# Simple Guide - Run Database Setup

## ⚡ Quick Start (3 Steps)

### Step 1: Create Database and Tables

```bash
cd oneflow-db
mysql -u root -p < complete-setup.sql
```

**What this does:**
- Creates database `oneflow`
- Creates user `oneflow_user`
- Creates all 12 tables

### Step 2: Insert Sample Data

```bash
mysql -u root -p oneflow < insert-all-data-ready.sql
```

**What this does:**
- Inserts 5 users
- Inserts 2 projects
- Inserts tasks, orders, invoices, etc.

### Step 3: Verify It Works

```bash
mysql -u oneflow_user -poneflow_password oneflow
```

If you can connect, you're done! ✅

## 📝 Manual Method (Copy & Paste)

### If you prefer to use MySQL Workbench or copy/paste:

1. **Open MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Run complete-setup.sql:**
   - Open file: `complete-setup.sql`
   - Copy ALL contents
   - Paste into MySQL
   - Press Enter

3. **Run insert-all-data-ready.sql:**
   - Open file: `insert-all-data-ready.sql`
   - Copy ALL contents
   - Paste into MySQL
   - Press Enter

4. **Verify:**
   ```sql
   USE oneflow;
   SHOW TABLES;
   SELECT COUNT(*) FROM users;
   ```

## 🎯 What You Need

- MySQL installed and running
- MySQL root password
- Command line or MySQL Workbench

## ✅ Success = You Can Connect

```bash
mysql -u oneflow_user -poneflow_password oneflow
```

If this works, your database is ready!

## 🚀 Next: Start the Application

1. **Backend:**
   ```bash
   cd oneflow-api
   npm install
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd oneflow-ui
   npm install
   npm run dev
   ```

3. **Login:**
   - Go to: http://localhost:5173
   - Email: `admin@oneflow.com`
   - Password: `password123`

