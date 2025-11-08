import { Router } from 'express';
import {
  getVendorBills,
  getVendorBill,
  createVendorBill,
  updateVendorBill,
  deleteVendorBill,
} from '../controllers/vendorBillController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin', 'sales_finance'), getVendorBills);
router.get('/:id', authenticate, requireRole('admin', 'sales_finance'), getVendorBill);
router.post('/', authenticate, requireRole('admin', 'sales_finance'), createVendorBill);
router.put('/:id', authenticate, requireRole('admin', 'sales_finance'), updateVendorBill);
router.delete('/:id', authenticate, requireRole('admin', 'sales_finance'), deleteVendorBill);

export default router;

