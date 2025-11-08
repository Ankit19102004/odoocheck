// User Types
export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash?: string;
  role: 'admin' | 'project_manager' | 'team_member' | 'sales_finance';
  hourly_rate: number;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
  skills?: IUserSkill[];
}

// User Skill Types
export interface IUserSkill {
  id: number;
  user_id: number;
  skill_name: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: Date;
  updated_at: Date;
}

// Project Types
export interface IProject {
  id: number;
  name: string;
  description?: string;
  manager_id: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  manager?: IUser;
  tags?: IProjectTag[];
}

export interface IProjectTag {
  id: number;
  project_id: number;
  tag: string;
}

// Task Types
export interface ITask {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  assignee_id?: number;
  status: 'new' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  time_estimate?: number;
  required_skills?: string[];
  created_at: Date;
  updated_at: Date;
  assignee?: IUser;
  project?: IProject;
}

// Timesheet Types
export interface ITimesheetEntry {
  id: number;
  task_id: number;
  user_id: number;
  date: Date;
  hours: number;
  billable: boolean;
  created_at: Date;
  updated_at: Date;
  task?: ITask;
  user?: IUser;
}

// Sales Order Types
export interface ISalesOrder {
  id: number;
  project_id: number;
  customer_name: string;
  total_amount: number;
  state: 'draft' | 'sent' | 'confirmed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  project?: IProject;
}

// Purchase Order Types
export interface IPurchaseOrder {
  id: number;
  project_id: number;
  vendor_name: string;
  total_amount: number;
  state: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  project?: IProject;
}

// Invoice Types
export interface IInvoice {
  id: number;
  project_id: number;
  sales_order_id?: number;
  invoice_number: string;
  amount: number;
  state: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  project?: IProject;
  sales_order?: ISalesOrder;
}

// Vendor Bill Types
export interface IVendorBill {
  id: number;
  project_id: number;
  purchase_order_id?: number;
  amount: number;
  state: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  project?: IProject;
  purchase_order?: IPurchaseOrder;
}

// Expense Types
export interface IExpense {
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
  project?: IProject;
  user?: IUser;
}

// Product Types
export interface IProduct {
  id: number;
  name: string;
  is_sales: boolean;
  is_purchase: boolean;
  price?: number;
  cost?: number;
  taxes?: number;
}

// Attachment Types
export interface IAttachment {
  id: number;
  owner_type: string;
  owner_id: number;
  filename: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

// Analytics Types
export interface IProjectAnalytics {
  project_id: number;
  revenue: number;
  cost: number;
  profit: number;
  hours_logged: number;
  invoice_count: number;
  expense_count: number;
  timesheet_count: number;
}

// Auth Types
export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: IUser['role'];
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

