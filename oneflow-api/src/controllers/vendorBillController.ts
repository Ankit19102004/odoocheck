import { Request, Response, NextFunction } from 'express';
import VendorBill from '../models/VendorBill';
import Project from '../models/Project';
import PurchaseOrder from '../models/PurchaseOrder';

export const getVendorBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, state } = req.query;
    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (state) where.state = state;

    const bills = await VendorBill.findAll({
      where,
      include: [
        { model: Project, as: 'project' },
        { model: PurchaseOrder, as: 'purchase_order' },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: bills });
  } catch (error: any) {
    next(error);
  }
};

export const getVendorBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bill = await VendorBill.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: PurchaseOrder, as: 'purchase_order' },
      ],
    });
    if (!bill) {
      res.status(404).json({ success: false, error: 'Vendor bill not found' });
      return;
    }
    res.json({ success: true, data: bill });
  } catch (error: any) {
    next(error);
  }
};

export const createVendorBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { purchase_order_id, ...billData } = req.body;

    if (purchase_order_id) {
      const purchaseOrder = await PurchaseOrder.findByPk(purchase_order_id);
      if (purchaseOrder) {
        billData.project_id = purchaseOrder.project_id;
        billData.amount = purchaseOrder.total_amount;
      }
    }

    const bill = await VendorBill.create(billData);
    const billWithRelations = await VendorBill.findByPk(bill.id, {
      include: [
        { model: Project, as: 'project' },
        { model: PurchaseOrder, as: 'purchase_order' },
      ],
    });
    res.status(201).json({ success: true, data: billWithRelations });
  } catch (error: any) {
    next(error);
  }
};

export const updateVendorBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bill = await VendorBill.findByPk(req.params.id);
    if (!bill) {
      res.status(404).json({ success: false, error: 'Vendor bill not found' });
      return;
    }
    await bill.update(req.body);
    res.json({ success: true, data: bill });
  } catch (error: any) {
    next(error);
  }
};

export const deleteVendorBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bill = await VendorBill.findByPk(req.params.id);
    if (!bill) {
      res.status(404).json({ success: false, error: 'Vendor bill not found' });
      return;
    }
    await bill.destroy();
    res.json({ success: true, message: 'Vendor bill deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

