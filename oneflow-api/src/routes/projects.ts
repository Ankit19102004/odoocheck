import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { authenticate, requireRole } from '../middleware/auth';
import { createProjectValidator, updateProjectValidator } from '../validators/projectValidators';

const router = Router();

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProject);
router.post('/', authenticate, requireRole('admin', 'project_manager'), createProjectValidator, createProject);
router.put('/:id', authenticate, requireRole('admin', 'project_manager'), updateProjectValidator, updateProject);
router.delete('/:id', authenticate, requireRole('admin', 'project_manager'), deleteProject);

export default router;

