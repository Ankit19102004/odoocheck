# ✅ Simple Database Setup (XAMPP)

## Good News: MySQL is Working! ✅

Your MySQL (XAMPP) is installed and working. Follow these simple steps:

---

## Step 1: Create Database and User

Run this command:
```powershell
mysql -u root -e "CREATE DATABASE IF NOT EXISTS oneflow; CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password'; GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost'; FLUSH PRIVILEGES;"
```

---

## Step 2: Create Tables

Run this command:
```powershell
Get-Content 02-create-tables.sql | mysql -u root oneflow
```

---

## Step 3: Insert Sample Data

Run this command:
```powershell
Get-Content insert-all-data-ready.sql | mysql -u root oneflow
```

---

## Step 4: Verify It Works

Run this command:
```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

You should see 12 tables listed.

---

## ✅ Done!

Your database is now set up! 

**Next steps:**
1. Go to `oneflow-api` folder
2. Run: `npm install`
3. Run: `npm run dev`

---

## Alternative: All-in-One Command

If you want to do everything at once:

```powershell
# Step 1: Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS oneflow; CREATE USER IF NOT EXISTS 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password'; GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost'; FLUSH PRIVILEGES;"

# Step 2: Create tables
Get-Content 02-create-tables.sql | mysql -u root oneflow

# Step 3: Insert data
Get-Content insert-all-data-ready.sql | mysql -u root oneflow

# Step 4: Verify
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

---

## Troubleshooting

### If you get "Access denied"
- XAMPP MySQL usually has no password for root
- Try: `mysql -u root` (without -p)

### If you get "Database already exists"
- That's OK! Just continue to Step 2 (create tables)

### If you get "Table already exists"
- Drop the database and start fresh:
  ```powershell
  mysql -u root -e "DROP DATABASE IF EXISTS oneflow;"
  ```
- Then run all steps again

---

## Using MySQL Workbench (Easier!)

If commands are giving you trouble:

1. **Open MySQL Workbench**
2. **Connect to:** `localhost` (user: `root`, no password)
3. **File → Open SQL Script →** Select `complete-setup.sql` → **Execute**
4. **File → Open SQL Script →** Select `insert-all-data-ready.sql` → **Execute**

Done! ✅

