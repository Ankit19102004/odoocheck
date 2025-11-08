import { Request, Response, NextFunction } from 'express';
import UserSkill from '../models/UserSkill';
import User from '../models/User';
import Task from '../models/Task';
import { Op } from 'sequelize';

// Get all skills for a user
export const getUserSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Users can only view their own skills unless they're admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    const skills = await UserSkill.findAll({
      where: { user_id: userId },
      order: [['skill_name', 'ASC']],
    });

    res.json({ success: true, data: skills });
  } catch (error: any) {
    next(error);
  }
};

// Add a skill to a user
export const addUserSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { skill_name, proficiency_level } = req.body;

    // Users can only add skills to themselves unless they're admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    if (!skill_name || !skill_name.trim()) {
      res.status(400).json({ success: false, error: 'Skill name is required' });
      return;
    }

    const validLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const level = proficiency_level && validLevels.includes(proficiency_level) 
      ? proficiency_level 
      : 'intermediate';

    // Check if skill already exists for user
    const existing = await UserSkill.findOne({
      where: { user_id: userId, skill_name: skill_name.trim() },
    });

    if (existing) {
      // Update existing skill
      await existing.update({ proficiency_level: level });
      res.json({ success: true, data: existing });
      return;
    }

    const skill = await UserSkill.create({
      user_id: userId,
      skill_name: skill_name.trim(),
      proficiency_level: level,
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, error: 'Skill already exists for this user' });
      return;
    }
    next(error);
  }
};

// Remove a skill from a user
export const removeUserSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, skillId } = req.params;
    const userId = parseInt(id);

    // Users can only remove their own skills unless they're admin
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    const skill = await UserSkill.findOne({
      where: { id: parseInt(skillId), user_id: userId },
    });

    if (!skill) {
      res.status(404).json({ success: false, error: 'Skill not found' });
      return;
    }

    await skill.destroy();
    res.json({ success: true, message: 'Skill removed successfully' });
  } catch (error: any) {
    next(error);
  }
};

// Get suggested assignees for a task based on required skills
export const getSuggestedAssignees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { required_skills } = req.query;

    if (!required_skills) {
      res.json({ success: true, data: [] });
      return;
    }

    // Parse required_skills - can be array or comma-separated string
    let skillsArray: string[] = [];
    if (Array.isArray(required_skills)) {
      skillsArray = required_skills.map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    } else if (typeof required_skills === 'string') {
      skillsArray = required_skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }

    if (skillsArray.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // Find users with matching skills
    const usersWithSkills = await UserSkill.findAll({
      where: {
        skill_name: { [Op.in]: skillsArray.map((s: string) => s.trim()) },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role'],
        },
      ],
    });

    // Group by user and calculate match score
    const userScores: Map<number, { user: User; skills: UserSkill[]; score: number }> = new Map();

    usersWithSkills.forEach((userSkill) => {
      const userId = userSkill.user_id;
      if (!userSkill.user) return;

      if (!userScores.has(userId)) {
        userScores.set(userId, {
          user: userSkill.user,
          skills: [],
          score: 0,
        });
      }

      const entry = userScores.get(userId)!;
      entry.skills.push(userSkill);

      // Calculate score based on proficiency level
      const proficiencyScores: Record<string, number> = {
        beginner: 1,
        intermediate: 2,
        advanced: 3,
        expert: 4,
      };
      entry.score += proficiencyScores[userSkill.proficiency_level] || 1;
    });

    // Convert to array and sort by score
    const suggestions = Array.from(userScores.values())
      .map((entry) => ({
        user: entry.user,
        matching_skills: entry.skills.map((s) => ({
          skill_name: s.skill_name,
          proficiency_level: s.proficiency_level,
        })),
        match_score: entry.score,
        match_percentage: Math.round((entry.skills.length / skillsArray.length) * 100),
      }))
      .sort((a, b) => b.match_score - a.match_score);

    res.json({ success: true, data: suggestions });
  } catch (error: any) {
    next(error);
  }
};

// Get all available skills (for autocomplete)
export const getAllSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await UserSkill.findAll({
      attributes: ['skill_name'],
      raw: true,
      order: [['skill_name', 'ASC']],
    });

    const uniqueSkills = [...new Set(skills.map((s: any) => s.skill_name))].sort();
    res.json({ success: true, data: uniqueSkills });
  } catch (error: any) {
    next(error);
  }
};

