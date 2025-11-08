import { Router } from 'express';
import { getProjectAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/project/:id/summary', authenticate, getProjectAnalytics);

export default router;

