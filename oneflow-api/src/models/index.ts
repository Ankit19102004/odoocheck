import { sequelize } from '../config/database';
import User from './User';
import Project from './Project';
import ProjectTag from './ProjectTag';
import Task from './Task';
import Timesheet from './Timesheet';
import SalesOrder from './SalesOrder';
import PurchaseOrder from './PurchaseOrder';
import Invoice from './Invoice';
import VendorBill from './VendorBill';
import Expense from './Expense';
import Product from './Product';
import Attachment from './Attachment';
import UserSkill from './UserSkill';

// Define all associations
User.hasMany(Project, { foreignKey: 'manager_id', as: 'managed_projects' });
User.hasMany(Task, { foreignKey: 'assignee_id', as: 'assigned_tasks' });
User.hasMany(Timesheet, { foreignKey: 'user_id', as: 'timesheets' });
User.hasMany(Expense, { foreignKey: 'user_id', as: 'expenses' });
User.hasMany(UserSkill, { foreignKey: 'user_id', as: 'skills' });
UserSkill.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

const db = {
  sequelize,
  User,
  Project,
  ProjectTag,
  Task,
  Timesheet,
  SalesOrder,
  PurchaseOrder,
  Invoice,
  VendorBill,
  Expense,
  Product,
  Attachment,
  UserSkill,
};

export default db;

