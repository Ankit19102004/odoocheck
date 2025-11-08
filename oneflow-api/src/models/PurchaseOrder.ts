import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';

interface PurchaseOrderAttributes {
  id: number;
  project_id: number;
  vendor_name: string;
  total_amount: number;
  state: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

interface PurchaseOrderCreationAttributes extends Optional<PurchaseOrderAttributes, 'id' | 'created_at' | 'updated_at'> {}

class PurchaseOrder extends Model<PurchaseOrderAttributes, PurchaseOrderCreationAttributes> implements PurchaseOrderAttributes {
  public id!: number;
  public project_id!: number;
  public vendor_name!: string;
  public total_amount!: number;
  public state!: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public project?: Project;
}

PurchaseOrder.init(
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
    vendor_name: {
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
      type: DataTypes.ENUM('draft', 'sent', 'confirmed', 'received', 'cancelled'),
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
    tableName: 'purchase_orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

PurchaseOrder.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Project.hasMany(PurchaseOrder, { foreignKey: 'project_id', as: 'purchase_orders' });

export default PurchaseOrder;

