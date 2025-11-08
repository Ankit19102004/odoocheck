# How to Insert Data into OneFlow Database

## 🚀 Quick Method (Recommended)

### Step 1: Create Tables First

```bash
mysql -u root -p < oneflow-db/complete-setup.sql
```

### Step 2: Insert All Data

```bash
mysql -u root -p oneflow < oneflow-db/insert-all-data-ready.sql
```

**Done!** Your database is now filled with sample data.

## 📋 Manual Method (Copy & Paste)

### Step 1: Open MySQL

```bash
mysql -u root -p
```

### Step 2: Select Database

```sql
USE oneflow;
```

### Step 3: Copy and Paste

Open the file `insert-all-data-ready.sql` and copy the entire contents, then paste into your MySQL command line.

Press Enter to execute.

## 📁 Files Available

1. **insert-all-data-ready.sql** ⭐ **USE THIS ONE**
   - Ready to use
   - Includes all INSERT statements
   - Has placeholder password hashes (may need updating)

2. **insert-all-data.sql**
   - Same as above but requires you to generate password hashes first

3. **generate-password-hash.js**
   - Script to generate password hashes
   - Run from oneflow-api directory: `cd ../oneflow-api && node -e "console.log(require('bcryptjs').hashSync('password123', 10))"`

## 🔑 Password Hashes

The file `insert-all-data-ready.sql` includes placeholder password hashes. 

**If login doesn't work**, generate real hashes:

```bash
cd oneflow-api
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

Then update the password_hash values in the INSERT statements.

## ✅ What Gets Inserted

- **5 Users** (admin, manager, 3 team members)
- **2 Projects** (Website Redesign, Mobile App)
- **4 Tasks** (with different statuses)
- **3 Timesheets** (time entries)
- **2 Sales Orders**
- **2 Purchase Orders**
- **2 Invoices**
- **2 Vendor Bills**
- **3 Expenses**
- **4 Products**

## 🧪 Test Login

After inserting, test with:
- Email: `admin@oneflow.com`
- Password: `password123`

## 🔍 Verify Data

```sql
USE oneflow;

-- Count all records
SELECT 
    'Users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'Projects', COUNT(*) FROM projects
UNION ALL SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL SELECT 'Timesheets', COUNT(*) FROM timesheets
UNION ALL SELECT 'Sales Orders', COUNT(*) FROM sales_orders
UNION ALL SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'Expenses', COUNT(*) FROM expenses;
```

## ⚠️ Troubleshooting

### "Table doesn't exist"
- Run table creation first: `mysql -u root -p < oneflow-db/complete-setup.sql`

### "Duplicate entry"
- Data already exists. Drop and recreate:
  ```sql
  DROP DATABASE oneflow;
  CREATE DATABASE oneflow;
  ```
  Then run setup again.

### "Cannot add foreign key constraint"
- Make sure parent tables exist
- Run INSERT statements in order (users first, then projects, etc.)

### "Password doesn't work"
- Generate new password hash and update the INSERT statement
- Or use the Sequelize seeder: `cd oneflow-api && npm run seed`

