# OneFlow Database - Complete SQL Manual Setup

This guide provides all SQL scripts needed to manually set up the OneFlow database.

## Files Overview

1. **01-create-database.sql** - Create database and user
2. **02-create-tables.sql** - Create all tables
3. **03-seed-data.sql** - Insert sample data
4. **complete-setup.sql** - All-in-one setup script
5. **setup-local-mysql.sql** - Quick database/user setup only

## Quick Setup (Recommended)

### Option 1: Run Complete Setup Script

```bash
mysql -u root -p < oneflow-db/complete-setup.sql
```

**Note:** The complete setup creates tables but doesn't insert user data with password hashes. You need to either:
- Run the Sequelize seeder: `cd oneflow-api && npm run seed`
- Or register users through the API

### Option 2: Step-by-Step Setup

1. **Create Database and User:**
   ```bash
   mysql -u root -p < oneflow-db/01-create-database.sql
   ```

2. **Create Tables:**
   ```bash
   mysql -u root -p < oneflow-db/02-create-tables.sql
   ```

3. **Generate Password Hashes:**
   ```bash
   cd oneflow-db
   node generate-password-hash.js
   ```
   
   Copy the generated hashes and update `03-seed-data.sql` with real hashes.

4. **Insert Sample Data:**
   ```bash
   mysql -u root -p < oneflow-db/03-seed-data.sql
   ```

### Option 3: Use Sequelize Seeder (Easiest)

After creating database and tables:

```bash
cd oneflow-api
npm run seed
```

This will properly hash passwords and insert all sample data.

## Manual SQL Execution

### Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Run SQL file
source /path/to/oneflow-db/complete-setup.sql

# Or copy and paste SQL commands directly
```

### Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open File → Open SQL Script
4. Select the SQL file
5. Click Execute (⚡)

## Database Structure

### Tables Created

1. **users** - User accounts with roles
2. **projects** - Projects
3. **project_tags** - Project tags
4. **tasks** - Tasks
5. **timesheets** - Time tracking entries
6. **sales_orders** - Sales orders
7. **purchase_orders** - Purchase orders
8. **invoices** - Invoices
9. **vendor_bills** - Vendor bills
10. **expenses** - Expenses
11. **products** - Products
12. **attachments** - File attachments

### Sample Data

The seed data includes:
- 5 users (admin, project manager, 3 team members)
- 2 projects
- 4 tasks
- 2 timesheet entries
- 1 sales order
- 1 purchase order
- 1 invoice
- 1 vendor bill
- 1 expense

## Default Credentials

- **Database:** oneflow
- **User:** oneflow_user
- **Password:** oneflow_password

### Test User Accounts (after seeding)

- **Admin:** admin@oneflow.com / password123
- **Manager:** manager@oneflow.com / password123
- **Team Member:** alice@oneflow.com / password123

## Important Notes

### Password Hashes

The SQL files use placeholder password hashes. For production:

1. **Generate real hashes:**
   ```bash
   cd oneflow-db
   node generate-password-hash.js
   ```

2. **Update seed data:**
   - Copy the generated hashes
   - Update `03-seed-data.sql` with real hashes
   - Or use the Sequelize seeder which handles this automatically

### Foreign Key Constraints

Tables are created with foreign key constraints. Insert data in this order:
1. users
2. projects
3. project_tags, tasks
4. timesheets, sales_orders, purchase_orders
5. invoices, vendor_bills, expenses

### Verification

After setup, verify the database:

```sql
USE oneflow;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM tasks;
```

## Troubleshooting

### "Access denied for user"
- Make sure user exists: `SELECT User FROM mysql.user WHERE User='oneflow_user';`
- Verify privileges: `SHOW GRANTS FOR 'oneflow_user'@'localhost';`

### "Cannot add foreign key constraint"
- Make sure parent table exists
- Check that referenced columns have matching data types
- Verify parent table has data before inserting child records

### "Duplicate entry" errors
- Drop and recreate database: `DROP DATABASE oneflow;`
- Or truncate tables before re-inserting data

### Password hash issues
- Use the Sequelize seeder instead: `npm run seed`
- Or generate hashes using: `node generate-password-hash.js`

## Next Steps

After database setup:

1. **Verify connection:**
   ```bash
   mysql -u oneflow_user -poneflow_password oneflow
   ```

2. **Start backend:**
   ```bash
   cd oneflow-api
   npm run dev
   ```

3. **Test API:**
   ```bash
   curl http://localhost:3001/health
   ```

4. **Register/Login:**
   - Use the API registration endpoint
   - Or use seeded test accounts (if seeder was run)

