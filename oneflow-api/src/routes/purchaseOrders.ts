import { Router } from 'express';
import {
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchaseOrderController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin', 'sales_finance'), getPurchaseOrders);
router.get('/:id', authenticate, requireRole('admin', 'sales_finance'), getPurchaseOrder);
router.post('/', authenticate, requireRole('admin', 'sales_finance'), createPurchaseOrder);
router.put('/:id', authenticate, requireRole('admin', 'sales_finance'), updatePurchaseOrder);
router.delete('/:id', authenticate, requireRole('admin', 'sales_finance'), deletePurchaseOrder);

export default router;

