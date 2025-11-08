import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Expense from '../models/Expense';
import Project from '../models/Project';
import User from '../models/User';
import { logger } from '../config/logger';
import { Op } from 'sequelize';

export const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, state, user_id } = req.query;
    const user = req.user;
    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (state) where.state = state;

    // Role-based filtering
    if (user?.role === 'team_member') {
      // Team members can only see their own expenses
      where.user_id = user.id;
    } else if (user?.role === 'project_manager') {
      // Project managers can see expenses in their projects
      const managerProjects = await Project.findAll({
        where: { manager_id: user.id },
        attributes: ['id'],
        raw: true,
      });
      const projectIds = managerProjects.map((p: any) => p.id);
      if (projectIds.length > 0) {
        where.project_id = { [Op.in]: projectIds };
      } else {
        res.json({ success: true, data: [] });
        return;
      }
    }
    // Admin and sales_finance can see all expenses

    if (user_id && (user?.role === 'admin' || user?.role === 'project_manager' || user?.role === 'sales_finance')) {
      where.user_id = user_id;
    }

    const expenses = await Expense.findAll({
      where,
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: expenses });
  } catch (error: any) {
    next(error);
  }
};

export const getExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' },
      ],
    });
    if (!expense) {
      res.status(404).json({ success: false, error: 'Expense not found' });
      return;
    }
    res.json({ success: true, data: expense });
  } catch (error: any) {
    next(error);
  }
};

export const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const expense = await Expense.create({
      ...req.body,
      user_id: req.body.user_id || req.user?.id,
    });

    const expenseWithRelations = await Expense.findByPk(expense.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' },
      ],
    });

    res.status(201).json({ success: true, data: expenseWithRelations });
  } catch (error: any) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }],
    });
    if (!expense) {
      res.status(404).json({ success: false, error: 'Expense not found' });
      return;
    }

    const user = req.user;
    const expenseData = expense as any;

    // Role-based access control
    if (user?.role === 'team_member') {
      // Team members can only update their own expenses, and only before approval
      if (expenseData.user_id !== user.id) {
        res.status(403).json({ success: false, error: 'You can only update your own expenses' });
        return;
      }
      if (expenseData.state === 'approved' || expenseData.state === 'rejected') {
        res.status(403).json({ success: false, error: 'You cannot modify approved or rejected expenses' });
        return;
      }
      // Team members can update everything except state (approval)
      const { state, ...updateData } = req.body;
      await expense.update(updateData);
    } else if (user?.role === 'project_manager') {
      // Project managers can approve expenses in their projects
      const project = expenseData.project;
      if (project.manager_id !== user.id) {
        res.status(403).json({ success: false, error: 'You can only approve expenses in projects you manage' });
        return;
      }
      // If approving expense and marking as billable, add to next invoice
      if (req.body.state === 'approved' && req.body.billable) {
        logger.info('Expense approved as billable', { expenseId: expense.id });
      }
      await expense.update(req.body);
    } else {
      // Admin and sales_finance can update any expense
      if (req.body.state === 'approved' && req.body.billable) {
        logger.info('Expense approved as billable', { expenseId: expense.id });
      }
      await expense.update(req.body);
    }

    const updatedExpense = await Expense.findByPk(expense.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'user' },
      ],
    });

    res.json({ success: true, data: updatedExpense });
  } catch (error: any) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      res.status(404).json({ success: false, error: 'Expense not found' });
      return;
    }
    await expense.destroy();
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

