# Windows Setup Guide - OneFlow Database

## 🪟 PowerShell Commands (Windows)

PowerShell doesn't support `<` redirection. Use these methods:

## Method 1: Use the PowerShell Script (Easiest!)

```powershell
# Run the setup script
.\run-setup.ps1
```

This script will:
1. Create database and tables
2. Insert sample data
3. Verify everything works

## Method 2: Use Get-Content (PowerShell Native)

```powershell
# Step 1: Create database and tables
Get-Content complete-setup.sql | mysql -u root -p

# Step 2: Insert sample data
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow

# Step 3: Verify
mysql -u oneflow_user -poneflow_password oneflow
```

## Method 3: Use cmd.exe

```powershell
# Step 1: Create database and tables
cmd /c "mysql -u root -p < complete-setup.sql"

# Step 2: Insert sample data
cmd /c "mysql -u root -p oneflow < insert-all-data-ready.sql"

# Step 3: Verify
mysql -u oneflow_user -poneflow_password oneflow
```

## Method 4: MySQL Workbench (Recommended for Windows!)

### Step 1: Open MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server

### Step 2: Create Database and Tables

1. Click **File** → **Open SQL Script**
2. Navigate to `oneflow-db` folder
3. Select `complete-setup.sql`
4. Click **Open**
5. Click **Execute** (⚡ button) or press `Ctrl+Shift+Enter`

### Step 3: Insert Sample Data

1. Click **File** → **Open SQL Script**
2. Select `insert-all-data-ready.sql`
3. Click **Open**
4. Click **Execute** (⚡ button) or press `Ctrl+Shift+Enter`

### Step 4: Verify

In MySQL Workbench, run:

```sql
USE oneflow;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
```

## Method 5: Manual Copy & Paste

### Step 1: Open MySQL Command Line

```powershell
mysql -u root -p
```

### Step 2: Create Database

Copy and paste this:

```sql
CREATE DATABASE IF NOT EXISTS oneflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;
USE oneflow;
```

### Step 3: Create Tables

1. Open `complete-setup.sql` in Notepad
2. Find the CREATE TABLE statements (after `USE oneflow;`)
3. Copy all CREATE TABLE statements
4. Paste into MySQL command line
5. Press Enter

### Step 4: Insert Data

1. Open `insert-all-data-ready.sql` in Notepad
2. Copy ALL contents (Ctrl+A, Ctrl+C)
3. In MySQL, make sure you're in the database: `USE oneflow;`
4. Paste the SQL (Right-click in terminal)
5. Press Enter

## ✅ Quick Commands Summary

### PowerShell Script (Easiest)
```powershell
.\run-setup.ps1
```

### Get-Content Method
```powershell
Get-Content complete-setup.sql | mysql -u root -p
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### cmd.exe Method
```powershell
cmd /c "mysql -u root -p < complete-setup.sql"
cmd /c "mysql -u root -p oneflow < insert-all-data-ready.sql"
```

### MySQL Workbench
- Open SQL files and execute them

## 🎯 Recommended: MySQL Workbench

For Windows users, **MySQL Workbench** is the easiest method:
1. No command line syntax issues
2. Visual interface
3. Easy to see errors
4. Can execute scripts with one click

## 🔍 Verify Setup

After setup, verify with:

```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

Or in MySQL Workbench:
```sql
USE oneflow;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

## 🆘 Troubleshooting

### "MySQL command not found"
- Add MySQL to your PATH
- Or use full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

### "Access denied"
- Check your MySQL root password
- Make sure MySQL service is running

### "Cannot connect to MySQL server"
- Start MySQL service:
  - Win + R → `services.msc`
  - Find "MySQL" → Right-click → Start

### PowerShell script won't run?
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

