import { body } from 'express-validator';

export const createProjectValidator = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('manager_id').optional().isInt().withMessage('Manager ID must be an integer'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled']).withMessage('Invalid status'),
];

export const updateProjectValidator = [
  body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled']).withMessage('Invalid status'),
];

