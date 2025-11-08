import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { requireRole } from '../middleware/auth';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Users can only update their own profile unless they're admin
    if (req.user?.id !== parseInt(id) && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Prevent users from deleting themselves
    if (req.user?.id === parseInt(id) && req.body.role && req.body.role !== user.role) {
      res.status(403).json({ success: false, error: 'You cannot change your own role' });
      return;
    }

    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password_hash = password;
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error: any) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Only admin can delete users
    if (req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Only admin can delete users' });
      return;
    }

    // Prevent users from deleting themselves
    if (req.user?.id === parseInt(id)) {
      res.status(403).json({ success: false, error: 'You cannot delete yourself' });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    await user.destroy();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only admin can create users
    if (req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Only admin can create users' });
      return;
    }

    const { first_name, last_name, email, password, role, hourly_rate } = req.body;

    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User with this email already exists' });
      return;
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password_hash: password,
      role: role || 'team_member',
      hourly_rate: hourly_rate || 0,
    });

    const newUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password_hash'] },
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    next(error);
  }
};

