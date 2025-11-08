import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Invoice from '../models/Invoice';
import SalesOrder from '../models/SalesOrder';
import Project from '../models/Project';
import { logger } from '../config/logger';

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { project_id, state } = req.query;
    const where: any = {};
    if (project_id) where.project_id = project_id;
    if (state) where.state = state;

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Project, as: 'project' },
        { model: SalesOrder, as: 'sales_order' },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: invoices });
  } catch (error: any) {
    next(error);
  }
};

export const getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: SalesOrder, as: 'sales_order' },
      ],
    });
    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found' });
      return;
    }
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: 'Validation failed', errors: errors.array() });
      return;
    }

    const { sales_order_id, ...invoiceData } = req.body;

    // If sales_order_id provided, link it and use its amount
    if (sales_order_id) {
      const salesOrder = await SalesOrder.findByPk(sales_order_id);
      if (salesOrder) {
        invoiceData.project_id = salesOrder.project_id;
        invoiceData.amount = salesOrder.total_amount;
      }
    }

    // Generate invoice number if not provided
    if (!invoiceData.invoice_number) {
      const count = await Invoice.count();
      invoiceData.invoice_number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }

    const invoice = await Invoice.create(invoiceData);
    const invoiceWithRelations = await Invoice.findByPk(invoice.id, {
      include: [
        { model: Project, as: 'project' },
        { model: SalesOrder, as: 'sales_order' },
      ],
    });

    logger.info('Invoice created from sales order', { invoiceId: invoice.id, salesOrderId: sales_order_id });

    res.status(201).json({ success: true, data: invoiceWithRelations });
  } catch (error: any) {
    next(error);
  }
};

export const updateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found' });
      return;
    }
    await invoice.update(req.body);
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    next(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      res.status(404).json({ success: false, error: 'Invoice not found' });
      return;
    }
    await invoice.destroy();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

