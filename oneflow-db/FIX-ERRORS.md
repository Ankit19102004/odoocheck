# 🔧 Quick Error Fix Guide

## What Error Are You Getting?

### If you see "MySQL command not found"
✅ **Good news:** MySQL is installed (XAMPP)! You just need to run commands correctly.

---

### If you see "Access denied" or password error

**Try this:**
```powershell
# Default XAMPP MySQL has NO password for root
mysql -u root
```

If that doesn't work, try:
```powershell
mysql -u root -p
# Press Enter when asked for password (leave it empty)
```

---

### If you see "Execution Policy" error

**Run this first:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try your command again.

---

### If you see "Database already exists"

**Option 1: Drop and recreate**
```powershell
mysql -u root -e "DROP DATABASE IF EXISTS oneflow;"
Get-Content complete-setup.sql | mysql -u root
```

**Option 2: Continue anyway** (database exists, just insert data)
```powershell
Get-Content insert-all-data-ready.sql | mysql -u root oneflow
```

---

### If you see SQL syntax errors

**Use MySQL Workbench instead:**
1. Open MySQL Workbench
2. Connect to your XAMPP MySQL (usually `localhost:3306`, user: `root`, no password)
3. File → Open SQL Script → Select `complete-setup.sql` → Execute
4. File → Open SQL Script → Select `insert-all-data-ready.sql` → Execute

---

## Simple Step-by-Step (No Scripts)

### Step 1: Open MySQL
```powershell
mysql -u root
```

### Step 2: Create Database (in MySQL prompt)
```sql
CREATE DATABASE IF NOT EXISTS oneflow;
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Create Tables
```powershell
Get-Content 02-create-tables.sql | mysql -u root oneflow
```

### Step 4: Insert Data
```powershell
Get-Content insert-all-data-ready.sql | mysql -u root oneflow
```

---

## Test It Works

```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

You should see 12 tables listed.

---

## Still Having Issues?

**Tell me:**
1. What exact error message do you see?
2. What command did you run?
3. What step are you on? (Database setup / Backend / Frontend)

