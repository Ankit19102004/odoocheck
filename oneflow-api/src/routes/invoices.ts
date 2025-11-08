import { Router } from 'express';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getInvoices); // All roles can view invoices
router.get('/:id', authenticate, getInvoice);
router.post('/', authenticate, requireRole('admin', 'sales_finance', 'project_manager'), createInvoice); // PMs can trigger invoices
router.put('/:id', authenticate, requireRole('admin', 'sales_finance', 'project_manager'), updateInvoice);
router.delete('/:id', authenticate, requireRole('admin', 'sales_finance'), deleteInvoice);

export default router;

