import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import SalesOrder from '../models/SalesOrder';
import Project from '../models/Project';
import { logger } from '../config/logger';

export const getSalesOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, state } = req.query;
    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (state) where.state = state;

    const orders = await SalesOrder.findAll({
      where,
      include: [{ model: Project, as: 'project' }],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: orders });
  } catch (error: any) {
    next(error);
  }
};

export const getSalesOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await SalesOrder.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }],
    });
    if (!order) {
      res.status(404).json({ success: false, error: 'Sales order not found' });
      return;
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    next(error);
  }
};

export const createSalesOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const order = await SalesOrder.create(req.body);
    const orderWithRelations = await SalesOrder.findByPk(order.id, {
      include: [{ model: Project, as: 'project' }],
    });

    res.status(201).json({ success: true, data: orderWithRelations });
  } catch (error: any) {
    next(error);
  }
};

export const updateSalesOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await SalesOrder.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Sales order not found' });
      return;
    }
    await order.update(req.body);
    res.json({ success: true, data: order });
  } catch (error: any) {
    next(error);
  }
};

export const deleteSalesOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await SalesOrder.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Sales order not found' });
      return;
    }
    await order.destroy();
    res.json({ success: true, message: 'Sales order deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

