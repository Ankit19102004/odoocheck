import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addTimesheet,
  getTimesheets,
} from '../controllers/taskController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTask);
router.post('/', authenticate, requireRole('admin', 'project_manager'), createTask);
router.put('/:id', authenticate, updateTask); // Role check in controller
router.delete('/:id', authenticate, requireRole('admin', 'project_manager'), deleteTask);
router.post('/:id/timesheets', authenticate, addTimesheet); // Team members can log hours
router.get('/:id/timesheets', authenticate, getTimesheets);

export default router;

