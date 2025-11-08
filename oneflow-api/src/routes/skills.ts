import { Router } from 'express';
import {
  getUserSkills,
  addUserSkill,
  removeUserSkill,
  getSuggestedAssignees,
  getAllSkills,
} from '../controllers/skillController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/all', authenticate, getAllSkills);
router.get('/users/:id', authenticate, getUserSkills);
router.post('/users/:id', authenticate, addUserSkill);
router.delete('/users/:id/:skillId', authenticate, removeUserSkill);
router.get('/suggestions', authenticate, getSuggestedAssignees);

export default router;

