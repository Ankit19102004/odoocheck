import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';
import PurchaseOrder from './PurchaseOrder';

interface VendorBillAttributes {
  id: number;
  project_id: number;
  purchase_order_id?: number;
  amount: number;
  state: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

interface VendorBillCreationAttributes extends Optional<VendorBillAttributes, 'id' | 'created_at' | 'updated_at' | 'purchase_order_id'> {}

class VendorBill extends Model<VendorBillAttributes, VendorBillCreationAttributes> implements VendorBillAttributes {
  public id!: number;
  public project_id!: number;
  public purchase_order_id?: number;
  public amount!: number;
  public state!: 'draft' | 'sent' | 'paid' | 'cancelled';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public project?: Project;
  public purchase_order?: PurchaseOrder;
}

VendorBill.init(
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
    purchase_order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    state: {
      type: DataTypes.ENUM('draft', 'sent', 'paid', 'cancelled'),
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
    tableName: 'vendor_bills',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

VendorBill.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
VendorBill.belongsTo(PurchaseOrder, { foreignKey: 'purchase_order_id', as: 'purchase_order' });
Project.hasMany(VendorBill, { foreignKey: 'project_id', as: 'vendor_bills' });

export default VendorBill;

