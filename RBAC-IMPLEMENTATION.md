# Role-Based Access Control (RBAC) Implementation

## Overview

This document describes the role-based access control (RBAC) implementation for OneFlow. Each role has specific permissions and can only perform actions assigned to their role.

## Roles and Permissions

### 🔴 Admin
**Full access to everything:**
- ✅ Create/Edit/Delete all projects
- ✅ Create/Edit/Delete all tasks
- ✅ Assign tasks to any team member
- ✅ Approve/reject expenses
- ✅ Create/Edit/Delete invoices
- ✅ Create/Edit/Delete sales orders
- ✅ Create/Edit/Delete purchase orders
- ✅ Create/Edit/Delete vendor bills
- ✅ View all projects and tasks
- ✅ Manage users (future feature)

### 🟡 Project Manager
**Project and task management:**
- ✅ Create/Edit/Delete projects (only their own)
- ✅ Create/Edit/Delete tasks (in their projects)
- ✅ Assign tasks to team members
- ✅ Approve/reject expenses (in their projects)
- ✅ Trigger/create invoices (for their projects)
- ✅ View projects they manage
- ✅ View all tasks in their projects
- ❌ Cannot manage sales orders, purchase orders, vendor bills
- ❌ Cannot view projects they don't manage
- ❌ Cannot approve expenses outside their projects

### 🟢 Team Member
**Task and expense management:**
- ✅ View assigned tasks only
- ✅ Update task status (their own tasks)
- ✅ Log hours (timesheets)
- ✅ Create/submit expenses
- ✅ Update their own expenses (before approval)
- ✅ View projects they're assigned to (via tasks)
- ❌ Cannot create projects
- ❌ Cannot create tasks
- ❌ Cannot assign tasks
- ❌ Cannot approve expenses
- ❌ Cannot create invoices
- ❌ Cannot view projects they're not assigned to
- ❌ Cannot edit tasks assigned to others

### 🔵 Sales/Finance
**Financial management:**
- ✅ Create/Edit/Delete sales orders
- ✅ Create/Edit/Delete purchase orders
- ✅ Create/Edit/Delete invoices
- ✅ Create/Edit/Delete vendor bills
- ✅ View all projects (read-only)
- ✅ View all expenses
- ✅ Approve/reject expenses
- ❌ Cannot create/edit projects
- ❌ Cannot create/edit tasks
- ❌ Cannot assign tasks

## Backend Implementation

### Project Controller
- **getProjects**: Filters projects by role
  - Team Member: Only projects with assigned tasks
  - Project Manager: Only projects they manage
  - Admin/Sales/Finance: All projects
- **getProject**: Checks access before returning project
- **createProject**: Only Admin and Project Manager
- **updateProject**: Project Manager can only update their own projects
- **deleteProject**: Project Manager can only delete their own projects

### Task Controller
- **getTasks**: Filters tasks by role
  - Team Member: Only tasks assigned to them
  - Project Manager: Tasks in their projects
  - Admin/Sales/Finance: All tasks
- **createTask**: Only Admin and Project Manager
- **updateTask**: 
  - Team Member: Can only update status of their own tasks
  - Project Manager: Can update tasks in their projects
  - Admin: Can update any task
- **deleteTask**: Only Admin and Project Manager
- **addTimesheet**: All authenticated users can log hours

### Expense Controller
- **getExpenses**: Filters expenses by role
  - Team Member: Only their own expenses
  - Project Manager: Expenses in their projects
  - Admin/Sales/Finance: All expenses
- **createExpense**: All authenticated users can create expenses
- **updateExpense**:
  - Team Member: Can update their own expenses (except state/approval)
  - Project Manager: Can approve expenses in their projects
  - Admin/Sales/Finance: Can approve any expense

### Invoice Controller
- **getInvoices**: All authenticated users can view
- **createInvoice**: Admin, Sales/Finance, Project Manager
- **updateInvoice**: Admin, Sales/Finance, Project Manager
- **deleteInvoice**: Only Admin and Sales/Finance

### Sales Order, Purchase Order, Vendor Bill Routes
- **All operations**: Only Admin and Sales/Finance

## Frontend Implementation

### Role Utility Functions (`oneflow-ui/src/utils/roles.ts`)
- `canCreateProject()`: Admin, Project Manager
- `canEditProject()`: Admin, Project Manager
- `canDeleteProject()`: Admin, Project Manager
- `canCreateTask()`: Admin, Project Manager
- `canEditTask()`: Admin, Project Manager, or Team Member (own tasks)
- `canApproveExpense()`: Admin, Project Manager
- `canCreateInvoice()`: Admin, Sales/Finance, Project Manager
- `canManageFinancials()`: Admin, Sales/Finance

### UI Components

#### Projects Page
- **Create Project button**: Only shown for Admin and Project Manager
- **Project list**: Filtered by role (backend)

#### Project Detail Page
- **Edit Project button**: Only shown for Admin and Project Manager
- **Delete Project button**: Only shown for Admin and Project Manager
- **Project Settings button**: Only shown for Admin and Sales/Finance

#### Project Tasks Page
- **Create Task button**: Only shown for Admin and Project Manager
- **Task list**: Filtered by role (backend)

#### Sidebar Navigation
- **Sales Orders**: Only shown for Admin and Sales/Finance
- **Purchase Orders**: Only shown for Admin and Sales/Finance
- **Invoices**: Shown for Admin, Sales/Finance, and Project Manager
- **Vendor Bills**: Only shown for Admin and Sales/Finance
- **Expenses**: Shown for all roles
- **Projects**: Shown for all roles

#### Dashboard
- **Role-based welcome message**: Different message for each role
- **Project stats**: Filtered by role (backend)

## API Endpoints

### Projects
- `GET /api/projects` - Role-based filtering
- `GET /api/projects/:id` - Role-based access control
- `POST /api/projects` - Admin, Project Manager only
- `PUT /api/projects/:id` - Admin, Project Manager (own projects)
- `DELETE /api/projects/:id` - Admin, Project Manager (own projects)

### Tasks
- `GET /api/tasks` - Role-based filtering
- `GET /api/tasks/:id` - All authenticated users
- `POST /api/tasks` - Admin, Project Manager only
- `PUT /api/tasks/:id` - Role-based (Team Member: status only, PM: own projects, Admin: all)
- `DELETE /api/tasks/:id` - Admin, Project Manager only
- `POST /api/tasks/:id/timesheets` - All authenticated users
- `GET /api/tasks/:id/timesheets` - All authenticated users

### Expenses
- `GET /api/expenses` - Role-based filtering
- `GET /api/expenses/:id` - All authenticated users
- `POST /api/expenses` - All authenticated users
- `PUT /api/expenses/:id` - Role-based (Team Member: own, PM: approve in projects, Admin/SF: all)
- `DELETE /api/expenses/:id` - Admin, Sales/Finance only

### Invoices
- `GET /api/invoices` - All authenticated users
- `GET /api/invoices/:id` - All authenticated users
- `POST /api/invoices` - Admin, Sales/Finance, Project Manager
- `PUT /api/invoices/:id` - Admin, Sales/Finance, Project Manager
- `DELETE /api/invoices/:id` - Admin, Sales/Finance only

### Sales Orders
- `GET /api/sales-orders` - Admin, Sales/Finance only
- `GET /api/sales-orders/:id` - Admin, Sales/Finance only
- `POST /api/sales-orders` - Admin, Sales/Finance only
- `PUT /api/sales-orders/:id` - Admin, Sales/Finance only
- `DELETE /api/sales-orders/:id` - Admin, Sales/Finance only

### Purchase Orders
- `GET /api/purchase-orders` - Admin, Sales/Finance only
- `GET /api/purchase-orders/:id` - Admin, Sales/Finance only
- `POST /api/purchase-orders` - Admin, Sales/Finance only
- `PUT /api/purchase-orders/:id` - Admin, Sales/Finance only
- `DELETE /api/purchase-orders/:id` - Admin, Sales/Finance only

### Vendor Bills
- `GET /api/vendor-bills` - Admin, Sales/Finance only
- `GET /api/vendor-bills/:id` - Admin, Sales/Finance only
- `POST /api/vendor-bills` - Admin, Sales/Finance only
- `PUT /api/vendor-bills/:id` - Admin, Sales/Finance only
- `DELETE /api/vendor-bills/:id` - Admin, Sales/Finance only

## Testing

### Test with Different Roles

1. **Admin** (`admin@oneflow.com`):
   - Should see all projects
   - Can create/edit/delete projects
   - Can create/edit/delete tasks
   - Can approve expenses
   - Can manage all financial records

2. **Project Manager** (`manager@oneflow.com`):
   - Should only see projects they manage
   - Can create projects
   - Can edit/delete their own projects
   - Can create/edit tasks in their projects
   - Can approve expenses in their projects
   - Cannot see sales orders, purchase orders, vendor bills menu

3. **Team Member** (`alice@oneflow.com`):
   - Should only see projects with assigned tasks
   - Cannot create projects
   - Can only see tasks assigned to them
   - Can update status of their own tasks
   - Can create/submit expenses
   - Cannot approve expenses
   - Cannot see sales orders, purchase orders, vendor bills menu

4. **Sales/Finance** (`carol@oneflow.com`):
   - Should see all projects (read-only)
   - Cannot create/edit projects
   - Can manage sales orders, purchase orders, invoices, vendor bills
   - Can approve expenses

## Security Notes

1. **Backend Validation**: All role checks are implemented in the backend controllers. Frontend UI restrictions are for UX only.
2. **Route Protection**: All routes use `authenticate` middleware and `requireRole` where needed.
3. **Data Filtering**: Queries are filtered by role to ensure users only see data they're allowed to access.
4. **Ownership Checks**: Project managers can only manage their own projects, team members can only update their own tasks.

## Future Enhancements

1. **User Management**: Admin should be able to manage users (create, edit, delete, assign roles)
2. **Project Settings Page**: Implement full financial management UI for Sales/Finance
3. **Task Assignment**: Better UI for project managers to assign tasks
4. **Expense Approval Workflow**: Better UI for expense approval
5. **Invoice Generation**: UI for project managers to trigger invoices
6. **Audit Logging**: Track who did what and when

