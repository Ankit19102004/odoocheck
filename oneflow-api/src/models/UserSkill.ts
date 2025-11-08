import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface UserSkillAttributes {
  id: number;
  user_id: number;
  skill_name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: Date;
  updated_at: Date;
}

interface UserSkillCreationAttributes extends Optional<UserSkillAttributes, 'id' | 'created_at' | 'updated_at' | 'proficiency_level'> {}

class UserSkill extends Model<UserSkillAttributes, UserSkillCreationAttributes> implements UserSkillAttributes {
  public id!: number;
  public user_id!: number;
  public skill_name!: string;
  public proficiency_level!: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public user?: User;
}

UserSkill.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    skill_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    proficiency_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
      allowNull: false,
      defaultValue: 'intermediate',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_skills',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['skill_name'] },
      { unique: true, fields: ['user_id', 'skill_name'] },
    ],
  }
);

// Associations will be set up in models/index.ts to avoid circular dependencies

export default UserSkill;

