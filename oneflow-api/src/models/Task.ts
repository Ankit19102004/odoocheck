import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Project from './Project';

interface TaskAttributes {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  assignee_id?: number;
  status: 'new' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  time_estimate?: number;
  // required_skills?: string[]; // Temporarily commented out until migration is run
  created_at: Date;
  updated_at: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'created_at' | 'updated_at' | 'description' | 'assignee_id' | 'deadline' | 'time_estimate'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public project_id!: number;
  public title!: string;
  public description?: string;
  public assignee_id?: number;
  public status!: 'new' | 'in_progress' | 'blocked' | 'done';
  public priority!: 'low' | 'medium' | 'high';
  public deadline?: Date;
  public time_estimate?: number;
  // public required_skills?: string[]; // Temporarily commented out until migration is run
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public assignee?: User;
  public project?: Project;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('new', 'in_progress', 'blocked', 'done'),
      allowNull: false,
      defaultValue: 'new',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    time_estimate: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    // required_skills: Temporarily commented out until database migration is run
    // Uncomment after running: oneflow-db/RUN-THIS-NOW.sql
    // required_skills: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    //   comment: 'Array of required skill names for this task',
    // },
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
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Task.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });

export default Task;

