# 🚀 How to Run Database Setup in PowerShell (Windows)

## ⚠️ Important: PowerShell Syntax

PowerShell uses different syntax than bash. Use these commands:

## Step 1: Create Database and Tables

### Option A: Using Get-Content (PowerShell)

```powershell
Get-Content complete-setup.sql | mysql -u root -p
```

### Option B: Using cmd.exe

```powershell
cmd /c "mysql -u root -p < complete-setup.sql"
```

### Option C: Manual Copy & Paste (Easiest)

1. Open `complete-setup.sql` in Notepad or any text editor
2. Copy ALL the contents (Ctrl+A, Ctrl+C)
3. Open MySQL:
   ```powershell
   mysql -u root -p
   ```
4. Paste the SQL (Right-click in terminal or Shift+Insert)
5. Press Enter

## Step 2: Insert Sample Data

### Option A: Using Get-Content (PowerShell)

```powershell
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### Option B: Using cmd.exe

```powershell
cmd /c "mysql -u root -p oneflow < insert-all-data-ready.sql"
```

### Option C: Manual Copy & Paste (Easiest)

1. Open `insert-all-data-ready.sql` in Notepad
2. Copy ALL the contents (Ctrl+A, Ctrl+C)
3. In MySQL (if still open), or run `mysql -u root -p` again
4. Type: `USE oneflow;` and press Enter
5. Paste the SQL content
6. Press Enter

## Step 3: Verify

```powershell
mysql -u oneflow_user -poneflow_password oneflow
```

## 🎯 Complete PowerShell Commands

```powershell
# Step 1: Create database and tables
Get-Content complete-setup.sql | mysql -u root -p

# Step 2: Insert data
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow

# Step 3: Verify
mysql -u oneflow_user -poneflow_password oneflow
```

## ✅ Alternative: Use MySQL Workbench (Easiest!)

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Create Database:**
   - Click "File" → "Open SQL Script"
   - Select `complete-setup.sql`
   - Click Execute (⚡ button)
4. **Insert Data:**
   - Click "File" → "Open SQL Script"
   - Select `insert-all-data-ready.sql`
   - Click Execute (⚡ button)

## 📝 Step-by-Step Manual Method

### 1. Open MySQL

```powershell
mysql -u root -p
```

Enter your MySQL root password.

### 2. Create Database (Copy & Paste)

```sql
CREATE DATABASE IF NOT EXISTS oneflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
FLUSH PRIVILEGES;
USE oneflow;
```

### 3. Create Tables

- Open `complete-setup.sql` in Notepad
- Find the table creation statements (after the USE oneflow; line)
- Copy all CREATE TABLE statements
- Paste into MySQL
- Press Enter

### 4. Insert Data

- Open `insert-all-data-ready.sql` in Notepad
- Copy ALL contents
- Paste into MySQL (make sure you're in the oneflow database: `USE oneflow;`)
- Press Enter

## 🔧 PowerShell Function (Optional)

Add this to your PowerShell profile for easier use:

```powershell
function Run-MySQLScript {
    param(
        [string]$Database,
        [string]$ScriptFile,
        [string]$User = "root"
    )
    
    if ($Database) {
        Get-Content $ScriptFile | mysql -u $User -p $Database
    } else {
        Get-Content $ScriptFile | mysql -u $User -p
    }
}
```

Then use:
```powershell
Run-MySQLScript -ScriptFile "complete-setup.sql"
Run-MySQLScript -Database "oneflow" -ScriptFile "insert-all-data-ready.sql"
```

