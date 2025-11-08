import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Task from './Task';

interface TimesheetAttributes {
  id: number;
  task_id: number;
  user_id: number;
  date: Date;
  hours: number;
  billable: boolean;
  created_at: Date;
  updated_at: Date;
}

interface TimesheetCreationAttributes extends Optional<TimesheetAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Timesheet extends Model<TimesheetAttributes, TimesheetCreationAttributes> implements TimesheetAttributes {
  public id!: number;
  public task_id!: number;
  public user_id!: number;
  public date!: Date;
  public hours!: number;
  public billable!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public user?: User;
  public task?: Task;
}

Timesheet.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 24,
      },
    },
    billable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'timesheets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Timesheet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Timesheet.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
Task.hasMany(Timesheet, { foreignKey: 'task_id', as: 'timesheets' });

export default Timesheet;

