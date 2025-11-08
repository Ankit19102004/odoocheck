# 🔧 Fix: Access Denied Error

## Error Message
```
Access denied for user 'oneflow_user'@'localhost' (using password: YES)
```

## Quick Fix

### Option 1: Use PowerShell Script (Easiest!)

```powershell
cd oneflow-db
.\fix-database-access.ps1
```

### Option 2: Run SQL Command

```powershell
mysql -u root -e "GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password'; FLUSH PRIVILEGES;"
```

### Option 3: Use MySQL Workbench

1. Open MySQL Workbench
2. Connect as `root` (no password)
3. Run this SQL:
```sql
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
FLUSH PRIVILEGES;
```

### Option 4: Recreate User

If the above doesn't work, recreate the user:

```powershell
mysql -u root -e "DROP USER IF EXISTS 'oneflow_user'@'localhost'; CREATE USER 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password'; GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost'; FLUSH PRIVILEGES;"
```

---

## Verify It Works

Test the connection:
```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

You should see 12 tables listed.

---

## After Fixing

1. **Go back to backend terminal**
2. **Restart the backend:**
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

## Still Having Issues?

1. **Check if MySQL service is running:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*mysql*"}
   ```

2. **Check database exists:**
   ```powershell
   mysql -u root -e "SHOW DATABASES LIKE 'oneflow';"
   ```

3. **Check user exists:**
   ```powershell
   mysql -u root -e "SELECT User, Host FROM mysql.user WHERE User='oneflow_user';"
   ```

