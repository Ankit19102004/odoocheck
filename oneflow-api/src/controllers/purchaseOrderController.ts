import { Request, Response, NextFunction } from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import Project from '../models/Project';

export const getPurchaseOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, state } = req.query;
    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (state) where.state = state;

    const orders = await PurchaseOrder.findAll({
      where,
      include: [{ model: Project, as: 'project' }],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: orders });
  } catch (error: any) {
    next(error);
  }
};

export const getPurchaseOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await PurchaseOrder.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }],
    });
    if (!order) {
      res.status(404).json({ success: false, error: 'Purchase order not found' });
      return;
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    next(error);
  }
};

export const createPurchaseOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await PurchaseOrder.create(req.body);
    const orderWithRelations = await PurchaseOrder.findByPk(order.id, {
      include: [{ model: Project, as: 'project' }],
    });
    res.status(201).json({ success: true, data: orderWithRelations });
  } catch (error: any) {
    next(error);
  }
};

export const updatePurchaseOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await PurchaseOrder.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Purchase order not found' });
      return;
    }
    await order.update(req.body);
    res.json({ success: true, data: order });
  } catch (error: any) {
    next(error);
  }
};

export const deletePurchaseOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await PurchaseOrder.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Purchase order not found' });
      return;
    }
    await order.destroy();
    res.json({ success: true, message: 'Purchase order deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

