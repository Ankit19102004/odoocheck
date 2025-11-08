import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import Timesheet from '../models/Timesheet';
import { logger } from '../config/logger';
import { Op } from 'sequelize';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, status, assignee_id } = req.query;
    const user = req.user;
    const where: any = {};

    if (project_id) {
      where.project_id = project_id;
    }
    if (status) {
      where.status = status;
    }

    // Role-based filtering
    if (user?.role === 'team_member') {
      // Team members can only see tasks assigned to them
      where.assignee_id = user.id;
    } else if (user?.role === 'project_manager') {
      // Project managers can see all tasks in their projects
      const managerProjects = await Project.findAll({
        where: { manager_id: user.id },
        attributes: ['id'],
        raw: true,
      });
      const projectIds = managerProjects.map((p: any) => p.id);
      if (projectIds.length > 0) {
        where.project_id = { [Op.in]: projectIds };
      } else {
        // No projects managed, return empty
        res.json({ success: true, data: [] });
        return;
      }
    }
    // Admin and sales_finance can see all tasks (no additional filter)

    if (assignee_id && (user?.role === 'admin' || user?.role === 'project_manager' || user?.role === 'sales_finance')) {
      where.assignee_id = assignee_id;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name', 'email', 'avatar_url'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        { model: User, as: 'assignee' },
        { model: Project, as: 'project' },
        { model: Timesheet, as: 'timesheets', include: [{ model: User, as: 'user' }] },
      ],
    });

    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const { project_id, title, description, assignee_id, status, priority, deadline, time_estimate } = req.body;

    const task = await Task.create({
      project_id,
      title,
      description,
      assignee_id,
      status: status || 'new',
      priority: priority || 'medium',
      deadline,
      time_estimate,
      // required_skills: Temporarily disabled until migration is run
    });

    const taskWithRelations = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee' },
        { model: Project, as: 'project' },
      ],
    });

    logger.info('Task created', { taskId: task.id, projectId: project_id });

    res.status(201).json({
      success: true,
      data: taskWithRelations,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, assignee_id, status, priority, deadline, time_estimate } = req.body;
    const user = req.user;

    const task = await Task.findByPk(id, {
      include: [{ model: Project, as: 'project' }],
    });
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    // Role-based access control
    if (user?.role === 'team_member') {
      // Team members can only update their own tasks, and only status
      if (task.assignee_id !== user.id) {
        res.status(403).json({ success: false, error: 'You can only update tasks assigned to you' });
        return;
      }
      // Team members can only update status, not other fields
      await task.update({
        status,
      });
    } else if (user?.role === 'project_manager') {
      // Project managers can update tasks in their projects
      const project = task.project as any;
      if (project.manager_id !== user.id) {
        res.status(403).json({ success: false, error: 'You can only update tasks in projects you manage' });
        return;
      }
      await task.update({
        title,
        description,
        assignee_id,
        status,
        priority,
        deadline,
        time_estimate,
        // required_skills: Temporarily disabled until migration is run
      });
    } else {
      // Admin can update anything
      await task.update({
        title,
        description,
        assignee_id,
        status,
        priority,
        deadline,
        time_estimate,
        // required_skills: Temporarily disabled until migration is run
      });
    }

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee' },
        { model: Project, as: 'project' },
      ],
    });

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const addTimesheet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { user_id, date, hours, billable } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      res.status(404).json({ success: false, error: 'Task not found' });
      return;
    }

    const timesheet = await Timesheet.create({
      task_id: parseInt(id),
      user_id: user_id || req.user?.id,
      date,
      hours,
      billable: billable !== undefined ? billable : true,
    });

    const timesheetWithRelations = await Timesheet.findByPk(timesheet.id, {
      include: [
        { model: User, as: 'user' },
        { model: Task, as: 'task' },
      ],
    });

    res.status(201).json({
      success: true,
      data: timesheetWithRelations,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTimesheets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const timesheets = await Timesheet.findAll({
      where: { task_id: id },
      include: [
        { model: User, as: 'user' },
        { model: Task, as: 'task' },
      ],
      order: [['date', 'DESC']],
    });

    res.json({
      success: true,
      data: timesheets,
    });
  } catch (error: any) {
    next(error);
  }
};

