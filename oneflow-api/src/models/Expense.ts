import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';
import User from './User';

interface ExpenseAttributes {
  id: number;
  project_id: number;
  user_id: number;
  amount: number;
  description: string;
  billable: boolean;
  receipt_url?: string;
  state: 'pending' | 'approved' | 'rejected' | 'paid';
  created_at: Date;
  updated_at: Date;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id' | 'created_at' | 'updated_at' | 'receipt_url'> {}

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
  public id!: number;
  public project_id!: number;
  public user_id!: number;
  public amount!: number;
  public description!: string;
  public billable!: boolean;
  public receipt_url?: string;
  public state!: 'pending' | 'approved' | 'rejected' | 'paid';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public project?: Project;
  public user?: User;
}

Expense.init(
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
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    billable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    receipt_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'),
      allowNull: false,
      defaultValue: 'pending',
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
    tableName: 'expenses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Expense.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Expense.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Project.hasMany(Expense, { foreignKey: 'project_id', as: 'expenses' });

export default Expense;

