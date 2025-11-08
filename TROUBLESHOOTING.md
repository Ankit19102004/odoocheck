# 🔧 Troubleshooting Guide - OneFlow

## Common Errors and Solutions

### Error 1: "MySQL command not found"

**Problem:** MySQL is not in your PATH or not installed.

**Solutions:**

#### Check if MySQL is installed:
```powershell
mysql --version
```

#### If MySQL is installed but not in PATH:

1. **Find MySQL installation:**
   - Usually at: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
   - Or: `C:\xampp\mysql\bin\mysql.exe` (if using XAMPP)

2. **Add to PATH:**
   - Windows → Settings → System → About → Advanced system settings
   - Environment Variables → Path → Edit → New
   - Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Click OK and restart terminal

3. **Or use full path:**
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
   ```

---

### Error 2: "Access denied for user 'root'@'localhost'"

**Problem:** Wrong MySQL root password or MySQL service not running.

**Solutions:**

1. **Check MySQL service is running:**
   ```powershell
   # Check service status
   Get-Service | Where-Object {$_.Name -like "*mysql*"}
   ```

2. **Start MySQL service:**
   ```powershell
   # Start MySQL service
   net start MySQL80
   # Or if different name:
   net start MySQL
   ```

3. **Reset MySQL root password** (if needed):
   - Check MySQL documentation for password reset
   - Or use MySQL Workbench to change password

4. **Try without password** (if MySQL allows):
   ```powershell
   mysql -u root
   ```

---

### Error 3: "Execution Policy" error when running PowerShell script

**Error:** `cannot be loaded because running scripts is disabled on this system`

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try running the script again:
```powershell
.\run-setup.ps1
```

---

### Error 4: "Database 'oneflow' already exists"

**Problem:** Database was already created.

**Solutions:**

1. **Drop and recreate:**
   ```powershell
   mysql -u root -p -e "DROP DATABASE IF EXISTS oneflow;"
   ```

2. **Or continue with next steps** (just skip database creation)

---

### Error 5: "Table already exists"

**Problem:** Tables were already created.

**Solutions:**

1. **Drop database and start fresh:**
   ```powershell
   mysql -u root -p -e "DROP DATABASE IF EXISTS oneflow;"
   Get-Content complete-setup.sql | mysql -u root -p
   ```

2. **Or just insert data:**
   ```powershell
   Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
   ```

---

### Error 6: "npm install" fails

**Problem:** Network issues, corrupted cache, or missing dependencies.

**Solutions:**

1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   ```

3. **Reinstall:**
   ```powershell
   npm install
   ```

4. **Use different registry (if network issues):**
   ```powershell
   npm install --registry https://registry.npmjs.org/
   ```

---

### Error 7: "Port 3001 already in use" (Backend)

**Problem:** Another application is using port 3001.

**Solutions:**

1. **Find what's using the port:**
   ```powershell
   netstat -ano | findstr :3001
   ```

2. **Kill the process:**
   ```powershell
   taskkill /PID <process_id> /F
   ```

3. **Or change port in `oneflow-api/.env`:**
   ```
   PORT=3002
   ```

---

### Error 8: "Port 5173 already in use" (Frontend)

**Problem:** Another application is using port 5173.

**Solutions:**

1. **Vite will automatically use next available port** (check terminal output)

2. **Or specify different port in `oneflow-ui/.env`:**
   ```
   VITE_PORT=5174
   ```

---

### Error 9: "Cannot connect to database" (Backend)

**Problem:** Database credentials wrong or MySQL not running.

**Solutions:**

1. **Check `oneflow-api/.env` file:**
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=oneflow
   DB_USER=oneflow_user
   DB_PASSWORD=oneflow_password
   ```

2. **Test database connection:**
   ```powershell
   mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
   ```

3. **Check MySQL is running:**
   ```powershell
   net start MySQL80
   ```

4. **Verify database exists:**
   ```powershell
   mysql -u root -p -e "SHOW DATABASES LIKE 'oneflow';"
   ```

---

### Error 10: "Module not found" errors

**Problem:** Dependencies not installed or wrong directory.

**Solutions:**

1. **Make sure you're in the right directory:**
   ```powershell
   # For backend
   cd oneflow-api
   npm install
   
   # For frontend
   cd oneflow-ui
   npm install
   ```

2. **Check if node_modules exists:**
   ```powershell
   Test-Path node_modules
   ```

3. **Reinstall dependencies:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

---

### Error 11: PowerShell script encoding issues

**Problem:** Special characters not displaying correctly.

**Solution:** Run commands manually instead:
```powershell
Get-Content complete-setup.sql | mysql -u root -p
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

---

### Error 12: SQL syntax errors

**Problem:** SQL file has syntax errors or incompatible with MySQL version.

**Solutions:**

1. **Check MySQL version:**
   ```powershell
   mysql --version
   ```

2. **Try running SQL file in MySQL Workbench** (easier to see errors)

3. **Check SQL file encoding** (should be UTF-8)

---

## Quick Diagnostic Commands

### Check MySQL:
```powershell
mysql --version
mysql -u root -p -e "SELECT VERSION();"
```

### Check Node.js:
```powershell
node --version
npm --version
```

### Check if database exists:
```powershell
mysql -u root -p -e "SHOW DATABASES LIKE 'oneflow';"
```

### Check if tables exist:
```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

### Check MySQL service:
```powershell
Get-Service | Where-Object {$_.Name -like "*mysql*"}
```

### Test database connection:
```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SELECT COUNT(*) FROM users;"
```

---

## Still Having Issues?

1. **Check all prerequisites:**
   - ✅ MySQL installed and running
   - ✅ Node.js 18+ installed
   - ✅ MySQL in PATH
   - ✅ MySQL service running

2. **Try MySQL Workbench:**
   - Easier to see errors
   - Visual interface
   - Can run SQL scripts directly

3. **Check logs:**
   - Backend logs: `oneflow-api/logs/`
   - MySQL error log: Check MySQL installation directory

4. **Verify file paths:**
   - Make sure you're in the correct directory
   - Check if SQL files exist

---

## Getting Help

If you're still stuck, provide:
1. **Error message** (full text)
2. **Command you ran**
3. **MySQL version:** `mysql --version`
4. **Node.js version:** `node --version`
5. **Operating System:** Windows 10/11
6. **What step failed:** Database setup / Backend / Frontend

