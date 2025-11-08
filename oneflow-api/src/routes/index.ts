import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import analyticsRoutes from './analytics';
import salesOrderRoutes from './salesOrders';
import purchaseOrderRoutes from './purchaseOrders';
import invoiceRoutes from './invoices';
import vendorBillRoutes from './vendorBills';
import expenseRoutes from './expenses';
import userRoutes from './users';
import skillRoutes from './skills';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/sales-orders', salesOrderRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/vendor-bills', vendorBillRoutes);
router.use('/expenses', expenseRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);

export default router;

