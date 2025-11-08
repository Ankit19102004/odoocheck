import { Router } from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getExpenses);
router.get('/:id', authenticate, getExpense);
router.post('/', authenticate, createExpense); // Team members can create expenses
router.put('/:id', authenticate, updateExpense); // Role check in controller (PMs approve, team members update their own)
router.delete('/:id', authenticate, requireRole('admin', 'sales_finance'), deleteExpense);

export default router;

