import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';

interface SalesOrderAttributes {
  id: number;
  project_id: number;
  customer_name: string;
  total_amount: number;
  state: 'draft' | 'sent' | 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

interface SalesOrderCreationAttributes extends Optional<SalesOrderAttributes, 'id' | 'created_at' | 'updated_at'> {}

class SalesOrder extends Model<SalesOrderAttributes, SalesOrderCreationAttributes> implements SalesOrderAttributes {
  public id!: number;
  public project_id!: number;
  public customer_name!: string;
  public total_amount!: number;
  public state!: 'draft' | 'sent' | 'confirmed' | 'cancelled';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public project?: Project;
}

SalesOrder.init(
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
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    state: {
      type: DataTypes.ENUM('draft', 'sent', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
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
    tableName: 'sales_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

SalesOrder.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Project.hasMany(SalesOrder, { foreignKey: 'project_id', as: 'sales_orders' });

export default SalesOrder;

