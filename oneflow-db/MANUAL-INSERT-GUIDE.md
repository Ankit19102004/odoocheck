# Manual INSERT Guide - Fill OneFlow Database

This guide shows you exactly how to manually insert data into your OneFlow database.

## 📋 Quick Steps

### Step 1: Generate Password Hashes

First, you need to generate bcrypt password hashes for the users:

```bash
cd oneflow-db
node generate-password-hash.js
```

This will output hashes like:
```
admin@oneflow.com: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
manager@oneflow.com: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
...
```

### Step 2: Update INSERT File

1. Open `insert-all-data.sql`
2. Find the INSERT INTO users statement
3. Replace the password_hash values with the real hashes from Step 1

### Step 3: Run the INSERT File

```bash
mysql -u root -p oneflow < oneflow-db/insert-all-data.sql
```

Or copy and paste the entire file into MySQL Workbench or command line.

## 📝 What Gets Inserted

### Users (5)
- Admin User (admin@oneflow.com)
- Project Manager (manager@oneflow.com)
- Team Members (alice, bob)
- Sales/Finance (carol)

### Projects (2)
- Website Redesign
- Mobile App Development

### Tasks (4)
- Design homepage
- Implement responsive layout
- Setup CI/CD pipeline
- Design app wireframes

### Other Data
- 3 Timesheet entries
- 2 Sales Orders
- 2 Purchase Orders
- 2 Invoices
- 2 Vendor Bills
- 3 Expenses
- 4 Products

## 🔑 Default Passwords

All users have the same password: **password123**

After inserting, you can login with:
- Email: admin@oneflow.com
- Password: password123

## ✅ Verify Data

After running the INSERT file, verify with:

```sql
USE oneflow;

-- Count records
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Timesheets', COUNT(*) FROM timesheets
UNION ALL
SELECT 'Sales Orders', COUNT(*) FROM sales_orders
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses;
```

## 🛠️ Alternative: Use Sequelize Seeder

If you prefer not to manually update password hashes, use the Sequelize seeder:

```bash
cd oneflow-api
npm run seed
```

This automatically generates proper password hashes and inserts all data.

## 📄 File Structure

- **insert-all-data.sql** - Complete INSERT statements (ready to use)
- **generate-password-hash.js** - Script to generate password hashes
- **MANUAL-INSERT-GUIDE.md** - This guide

## ⚠️ Important Notes

1. **Password Hashes**: The file includes placeholder hashes. You MUST replace them with real bcrypt hashes.

2. **Order Matters**: The INSERT statements are in the correct order (respecting foreign keys):
   - Users first
   - Projects second
   - Then tasks, timesheets, orders, etc.

3. **Variables**: The file uses MySQL variables (@admin_id, @project1_id, etc.) to handle foreign key relationships.

4. **If Errors**: Make sure you've run the table creation script first (`02-create-tables.sql` or `complete-setup.sql`).

