# OneFlow — Plan to Bill in One Place

A comprehensive full-stack project management system with integrated billing, invoicing, and expense tracking.

## 🚀 How to Run

**👉 [START.md](START.md)** - ⭐ START HERE - Simple 3-step guide  
**👉 [RUN-NOW.md](RUN-NOW.md)** - Detailed step-by-step instructions  
**👉 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common errors and solutions

### Quick Overview:
1. **Setup Environment** → Run `.\setup-env.ps1` from project root
2. **Start Backend** → `cd oneflow-api && npm install && npm run dev`
3. **Start Frontend** → `cd oneflow-ui && npm install && npm run dev`
4. **Open Browser** → http://localhost:5173

**Note:** Database is already set up! ✅

## Overview

OneFlow is a monorepo project management system that enables teams to manage projects, tasks, timesheets, sales orders, purchase orders, invoices, and expenses—all in one place. It features role-based access control, JWT authentication, and a modern React frontend with a Kanban board for task management.

## Tech Stack

### Frontend (`oneflow-ui`)
- React 18 + Vite
- TypeScript
- React Router
- TanStack Query (React Query)
- React Beautiful DnD (Kanban drag-and-drop)
- Recharts (Analytics charts)
- Axios

### Backend (`oneflow-api`)
- Node.js + Express
- TypeScript
- Sequelize ORM
- MySQL
- JWT Authentication
- Winston (Logging)
- Express Validator

### Database (`oneflow-db`)
- MySQL (local installation)
- SQL setup scripts
- Sequelize Migrations
- Seed Data

### Shared (`oneflow-shared`)
- TypeScript interfaces and types
- Shared between frontend and backend

## Project Structure

```
odoof/
├── oneflow-db/          # MySQL Docker setup, migrations, seeds
│   ├── docker-compose.yml
│   └── init.sql
├── oneflow-api/         # Express + TypeScript backend
│   ├── src/
│   │   ├── config/      # Database, logger config
│   │   ├── controllers/ # API controllers
│   │   ├── middleware/  # Auth, error handling
│   │   ├── models/      # Sequelize models
│   │   ├── migrations/  # Database migrations
│   │   ├── routes/      # API routes
│   │   ├── seeders/     # Seed data
│   │   ├── utils/       # JWT utilities
│   │   └── validators/  # Input validation
│   └── package.json
├── oneflow-ui/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   └── services/    # API service
│   └── package.json
└── oneflow-shared/      # Shared TypeScript types
    ├── src/
    │   └── index.ts
    └── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL installed and running locally
- Git

### 1. Setup Local MySQL Database

**Option 1: Using MySQL Command Line**
```bash
mysql -u root -p
# Then run the SQL commands from oneflow-db/setup-local-mysql.sql
```

**Option 2: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open and execute `oneflow-db/setup-local-mysql.sql`

**Option 3: Quick Setup**
```sql
CREATE DATABASE IF NOT EXISTS oneflow;
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Setup Backend

```bash
cd oneflow-api
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run migrate
npm run seed
npm run dev
```

The API will run on http://localhost:3001

### 3. Setup Frontend

```bash
cd oneflow-ui
cp .env.example .env
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### 4. Setup Shared Types (Optional)

```bash
cd oneflow-shared
npm install
npm run build
```

## Database Setup

### Local MySQL Setup

1. **Install MySQL** (if not already installed)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use package manager: `brew install mysql` (Mac), `apt-get install mysql-server` (Linux)

2. **Start MySQL Service**
   - Windows: MySQL should start automatically, or use Services
   - Mac/Linux: `sudo systemctl start mysql` or `brew services start mysql`

3. **Create Database and User**
   
   Run the setup script:
   ```bash
   mysql -u root -p < oneflow-db/setup-local-mysql.sql
   ```
   
   Or manually:
   ```sql
   CREATE DATABASE IF NOT EXISTS oneflow;
   CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
   GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Verify Connection**
   ```bash
   mysql -u oneflow_user -poneflow_password oneflow
   ```

5. **Update `.env` in `oneflow-api`** (if using different credentials)

### Running Migrations

```bash
cd oneflow-api
npm run migrate
```

### Seeding Data

```bash
cd oneflow-api
npm run seed
```

This creates:
- 1 admin user (admin@oneflow.com / password123)
- 1 project manager (manager@oneflow.com / password123)
- 3 team members
- 2 sample projects
- Sample tasks, sales orders, invoices, expenses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project
- `POST /api/projects` - Create project (Project Manager, Admin)
- `PUT /api/projects/:id` - Update project (Project Manager, Admin)
- `DELETE /api/projects/:id` - Delete project (Project Manager, Admin)

### Tasks
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/timesheets` - Add timesheet entry
- `GET /api/tasks/:id/timesheets` - Get timesheet entries

### Analytics
- `GET /api/analytics/project/:id/summary` - Get project analytics

### Sales Orders, Invoices, Expenses
- `GET /api/sales-orders` - List sales orders
- `POST /api/sales-orders` - Create sales order
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense

## Role-Based Access Control

### Roles
- **admin** - Full access to all features
- **project_manager** - Manage projects and tasks
- **team_member** - View projects, update tasks, log time
- **sales_finance** - Manage sales orders, invoices, expenses

### Protected Routes Examples

```typescript
// Admin and Project Manager only
router.post('/projects', authenticate, requireRole('admin', 'project_manager'), createProject);

// Sales/Finance only
router.post('/invoices', authenticate, requireRole('admin', 'sales_finance'), createInvoice);
```

## Example API Usage

### 1. Register/Login

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oneflow.com",
    "password": "password123"
  }'
```

### 2. Create Project

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "priority": "high",
    "status": "planning"
  }'
```

### 3. Create Sales Order

```bash
curl -X POST http://localhost:3001/api/sales-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "project_id": 1,
    "customer_name": "ABC Corp",
    "total_amount": 50000
  }'
```

### 4. Create Invoice from Sales Order

```bash
curl -X POST http://localhost:3001/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "project_id": 1,
    "sales_order_id": 1,
    "amount": 50000
  }'
```

### 5. Get Project Analytics

```bash
curl -X GET http://localhost:3001/api/analytics/project/1/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Frontend Features

### Pages
- **Login/Signup** - Authentication
- **Dashboard** - Role-based landing page with stats
- **Projects** - List and filter projects
- **Project Detail** - View project information
- **Project Tasks** - Kanban board for task management
- **Settings** - User profile settings

### Components
- **ProjectCard** - Project card with tags and status
- **KanbanBoard** - Drag-and-drop task board
- **Layout** - Sidebar navigation and layout

## Testing

### Backend Tests

```bash
cd oneflow-api
npm test
```

### Frontend Tests

```bash
cd oneflow-ui
npm test
```

## Environment Variables

### Backend (`oneflow-api/.env`)

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### Frontend (`oneflow-ui/.env`)

```env
VITE_API_URL=http://localhost:3001
```

## Business Logic Examples

### Creating Invoice from Sales Order
When creating an invoice with a `sales_order_id`, the system automatically:
- Links the invoice to the sales order's project
- Uses the sales order's total amount
- Updates project analytics (revenue calculation)

### Approving Expenses
When an expense is approved and marked as billable:
- It's added to the project cost
- Can be included in the next invoice
- Affects project profit calculation

### Timesheet Cost Calculation
Timesheet entries affect project cost:
- Cost = hours × user's hourly_rate
- Included in project analytics
- Affects profit calculation (revenue - costs)

## Analytics

Project analytics endpoint calculates:
- **Revenue**: Sum of paid invoices
- **Cost**: Vendor bills + Timesheets (hours × rate) + Expenses
- **Profit**: Revenue - Cost
- **Hours Logged**: Total hours from timesheets
- **Counts**: Invoice count, expense count, timesheet count

## Next Features (TODO)

- [ ] Purchase Order management UI
- [ ] Vendor Bill management UI
- [ ] Advanced analytics dashboard with charts
- [ ] File upload for attachments
- [ ] Email notifications
- [ ] Real-time updates (WebSockets)
- [ ] Export reports (PDF, Excel)
- [ ] Multi-tenancy support
- [ ] Advanced search and filters
- [ ] Activity feed
- [ ] Comments on tasks
- [ ] Time tracking timer
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Integration with accounting software

## Development

### Running in Development

1. Make sure MySQL is running locally
2. Start backend: `cd oneflow-api && npm run dev`
3. Start frontend: `cd oneflow-ui && npm run dev`

### Building for Production

```bash
# Backend
cd oneflow-api
npm run build
npm start

# Frontend
cd oneflow-ui
npm run build
npm run preview
```

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed using bcrypt
- CORS is configured for development
- Input validation using express-validator
- Role-based access control middleware
- SQL injection protection via Sequelize ORM

## License

ISC

## Contributors

See individual package READMEs for more details.
