// Role-based access control utilities

export type UserRole = 'admin' | 'project_manager' | 'team_member' | 'sales_finance';

export const hasRole = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

// Check if user can create projects
export const canCreateProject = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'project_manager']);
};

// Check if user can edit projects
export const canEditProject = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'project_manager']);
};

// Check if user can delete projects
export const canDeleteProject = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'project_manager']);
};

// Check if user can create tasks
export const canCreateTask = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'project_manager']);
};

// Check if user can edit tasks
export const canEditTask = (userRole: UserRole | undefined, taskAssigneeId?: number, userId?: number): boolean => {
  if (hasRole(userRole, ['admin', 'project_manager'])) return true;
  // Team members can only edit their own tasks
  if (userRole === 'team_member' && taskAssigneeId === userId) return true;
  return false;
};

// Check if user can approve expenses
export const canApproveExpense = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'project_manager']);
};

// Check if user can create invoices
export const canCreateInvoice = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'sales_finance', 'project_manager']);
};

// Check if user can manage sales/purchase orders, vendor bills
export const canManageFinancials = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'sales_finance']);
};

// Check if user can view all projects
export const canViewAllProjects = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['admin', 'sales_finance']);
};

