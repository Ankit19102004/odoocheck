import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/Project';
import ProjectTag from '../models/ProjectTag';
import Task from '../models/Task';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import { Op } from 'sequelize';

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, manager_id, search } = req.query;
    const user = req.user;
    
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const where: any = {};

    // Role-based filtering
    if (user.role === 'team_member') {
      // Team members can only see projects they're assigned to (via tasks)
      const userTasks = await Task.findAll({
        where: { assignee_id: user.id },
        attributes: ['project_id'],
        raw: true,
      });
      const projectIds = [...new Set(userTasks.map((t: any) => t.project_id).filter((id: any) => id !== null))];
      if (projectIds.length === 0) {
        res.json({ success: true, data: [] });
        return;
      }
      where.id = { [Op.in]: projectIds };
    } else if (user.role === 'project_manager') {
      // Project managers can only see projects they manage
      where.manager_id = user.id;
    }
    // Admin and sales_finance can see all projects (no additional filter)

    if (status) {
      where.status = status;
    }
    if (manager_id && (user.role === 'admin' || user.role === 'sales_finance')) {
      where.manager_id = manager_id;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const projects = await Project.findAll({
      where,
      include: [
        { 
          model: User, 
          as: 'manager', 
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url'],
          required: false,
        },
        { 
          model: ProjectTag, 
          as: 'tags',
          required: false,
        },
        { 
          model: Task, 
          as: 'tasks',
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    logger.error('Error fetching projects:', error);
    next(error);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const project = await Project.findByPk(id, {
      include: [
        { model: User, as: 'manager', attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url'] },
        { model: ProjectTag, as: 'tags' },
        {
          model: Task,
          as: 'tasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url'] }],
        },
      ],
    });

    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Role-based access control
    if (user?.role === 'team_member') {
      // Team members can only view projects they're assigned to
      const hasAssignedTask = await Task.findOne({
        where: { project_id: id, assignee_id: user.id },
      });
      if (!hasAssignedTask) {
        res.status(403).json({ success: false, error: 'You do not have access to this project' });
        return;
      }
    } else if (user?.role === 'project_manager') {
      // Project managers can only view projects they manage
      if (project.manager_id !== user.id) {
        res.status(403).json({ success: false, error: 'You can only view projects you manage' });
        return;
      }
    }
    // Admin and sales_finance can view all projects

    res.json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const { name, description, manager_id, deadline, priority, budget, status, tags } = req.body;

    const project = await Project.create({
      name,
      description,
      manager_id: manager_id || req.user?.id,
      deadline,
      priority: priority || 'medium',
      budget,
      status: status || 'planning',
    });

    // Add tags if provided
    if (tags && Array.isArray(tags)) {
      await Promise.all(
        tags.map((tag: string) =>
          ProjectTag.create({
            project_id: project.id,
            tag,
          })
        )
      );
    }

    const projectWithRelations = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'manager' },
        { model: ProjectTag, as: 'tags' },
      ],
    });

    logger.info('Project created', { projectId: project.id, userId: req.user?.id });

    res.status(201).json({
      success: true,
      data: projectWithRelations,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { name, description, manager_id, deadline, priority, budget, status, tags } = req.body;
    const user = req.user;

    const project = await Project.findByPk(id);
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Role-based access: Project managers can only update their own projects
    if (user?.role === 'project_manager' && project.manager_id !== user.id) {
      res.status(403).json({ success: false, error: 'You can only update projects you manage' });
      return;
    }

    // Update project fields
    await project.update({
      name,
      description,
      manager_id: user?.role === 'admin' ? manager_id : project.manager_id, // Only admin can change manager
      deadline,
      priority,
      budget,
      status,
    });

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove existing tags
      await ProjectTag.destroy({ where: { project_id: project.id } });
      // Add new tags
      await Promise.all(
        tags.map((tag: string) =>
          ProjectTag.create({
            project_id: project.id,
            tag,
          })
        )
      );
    }

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'manager' },
        { model: ProjectTag, as: 'tags' },
      ],
    });

    logger.info('Project updated', { projectId: project.id });

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const project = await Project.findByPk(id);
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }

    // Role-based access: Project managers can only delete their own projects
    if (user?.role === 'project_manager' && project.manager_id !== user.id) {
      res.status(403).json({ success: false, error: 'You can only delete projects you manage' });
      return;
    }

    await project.destroy();

    logger.info('Project deleted', { projectId: id });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

