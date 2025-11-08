import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Project from './Project';
import SalesOrder from './SalesOrder';

interface InvoiceAttributes {
  id: number;
  project_id: number;
  sales_order_id?: number;
  invoice_number: string;
  amount: number;
  state: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'created_at' | 'updated_at' | 'sales_order_id'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public project_id!: number;
  public sales_order_id?: number;
  public invoice_number!: string;
  public amount!: number;
  public state!: 'draft' | 'sent' | 'paid' | 'cancelled';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public project?: Project;
  public sales_order?: SalesOrder;
}

Invoice.init(
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
    sales_order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'sales_orders',
        key: 'id',
      },
    },
    invoice_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
    tableName: 'invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Invoice.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Invoice.belongsTo(SalesOrder, { foreignKey: 'sales_order_id', as: 'sales_order' });
Project.hasMany(Invoice, { foreignKey: 'project_id', as: 'invoices' });

export default Invoice;

