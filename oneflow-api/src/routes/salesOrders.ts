import { Router } from 'express';
import {
  getSalesOrders,
  getSalesOrder,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
} from '../controllers/salesOrderController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin', 'sales_finance'), getSalesOrders);
router.get('/:id', authenticate, requireRole('admin', 'sales_finance'), getSalesOrder);
router.post('/', authenticate, requireRole('admin', 'sales_finance'), createSalesOrder);
router.put('/:id', authenticate, requireRole('admin', 'sales_finance'), updateSalesOrder);
router.delete('/:id', authenticate, requireRole('admin', 'sales_finance'), deleteSalesOrder);

export default router;

