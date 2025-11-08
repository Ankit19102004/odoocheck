# 🔧 Fix: MySQL Database Connection Error

## Error Message
```
❌ Unable to connect to the database: SequelizeConnectionRefusedError
Error code: ECONNREFUSED
```

## Problem
MySQL database server is not running. The backend cannot connect to MySQL.

---

## Solution: Start MySQL Server

### Option 1: Using XAMPP (If Installed)

1. **Open XAMPP Control Panel**
   - Search for "XAMPP" in Windows Start Menu
   - Or go to: `C:\xampp\xampp-control.exe`

2. **Start MySQL**
   - Find "MySQL" in the list
   - Click **"Start"** button
   - Wait until status shows **"Running"** (green)

3. **Verify MySQL is Running**
   - MySQL should show green "Running" status
   - Port should show `3306`

---

### Option 2: Using Windows Services

1. **Open Services**
   - Press `Win + R`
   - Type: `services.msc`
   - Press Enter

2. **Find MySQL Service**
   - Look for services named:
     - `MySQL80`
     - `MySQL`
     - `MySQL57`
     - `MySQLService`

3. **Start MySQL Service**
   - Right-click on MySQL service
   - Click **"Start"**
   - Wait for status to change to **"Running"**

---

### Option 3: Using Command Line (PowerShell as Administrator)

```powershell
# Try common MySQL service names
net start MySQL80
# OR
net start MySQL
# OR
net start MySQL57
```

**Note:** You need to run PowerShell as Administrator for this to work.

---

### Option 4: Using MySQL Command Line

If MySQL is installed but service is not configured:

```powershell
# Navigate to MySQL bin directory (common locations)
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
# OR
cd "C:\xampp\mysql\bin"

# Start MySQL manually
.\mysqld.exe --console
```

---

## Verify MySQL is Running

### Check 1: Test MySQL Connection

```powershell
mysql -u root -p
```

If it connects, MySQL is running! ✅

### Check 2: Test with Database User

```powershell
mysql -u oneflow_user -poneflow_password oneflow
```

If it connects, database is ready! ✅

### Check 3: Check MySQL Port

```powershell
netstat -ano | findstr :3306
```

If you see output, MySQL is listening on port 3306! ✅

---

## After Starting MySQL

### Step 1: Verify Database Exists

```powershell
mysql -u root -p -e "SHOW DATABASES LIKE 'oneflow';"
```

**If database doesn't exist**, create it:
```powershell
cd oneflow-db
Get-Content complete-setup.sql | mysql -u root -p
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### Step 2: Start Backend Server

```powershell
cd oneflow-api
npm run dev
```

You should now see:
```
✅ Database connection established successfully.
🚀 Server is running on port 3001
```

---

## Common MySQL Service Names

Different MySQL installations use different service names:

- **MySQL 8.0:** `MySQL80`
- **MySQL 5.7:** `MySQL57`
- **XAMPP:** Usually no service (use XAMPP Control Panel)
- **WAMP:** `wampmysqld`
- **MAMP:** Check MAMP Control Panel

---

## Troubleshooting

### "MySQL service not found"
- MySQL might not be installed
- Install MySQL from: https://dev.mysql.com/downloads/mysql/
- Or install XAMPP from: https://www.apachefriends.org/

### "Access denied for user"
- Check database credentials in `oneflow-api/.env`
- Default credentials:
  - User: `oneflow_user`
  - Password: `oneflow_password`
  - Database: `oneflow`

### "Port 3306 already in use"
- Another MySQL instance is running
- Check which process is using port 3306:
  ```powershell
  netstat -ano | findstr :3306
  ```
- Stop the conflicting MySQL service

### "Cannot start MySQL service"
- Check MySQL error logs
- Common location: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`
- Or: `C:\xampp\mysql\data\*.err`

---

## Quick Check Script

Run this PowerShell script to check MySQL status:

```powershell
.\check-mysql.ps1
```

This will:
- ✅ Check if MySQL process is running
- ✅ Test MySQL connection
- ✅ Verify database exists

---

## Still Having Issues?

1. **Check MySQL Installation**
   ```powershell
   mysql --version
   ```

2. **Check MySQL Configuration**
   - Verify `oneflow-api/.env` file exists
   - Check database credentials match your MySQL setup

3. **Check Firewall**
   - Make sure Windows Firewall allows MySQL on port 3306

4. **Check MySQL Logs**
   - Look for error messages in MySQL error log files

---

## Summary

1. ✅ Start MySQL server (XAMPP, Services, or Command Line)
2. ✅ Verify MySQL is running on port 3306
3. ✅ Verify `oneflow` database exists
4. ✅ Start backend server: `cd oneflow-api && npm run dev`
5. ✅ Backend should connect successfully!

