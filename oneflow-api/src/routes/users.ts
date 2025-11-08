import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin', 'project_manager'), getUsers);
router.post('/', authenticate, requireRole('admin'), createUser);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

export default router;

