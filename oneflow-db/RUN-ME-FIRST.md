# 🚀 How to Run OneFlow Database Setup

## Step-by-Step Instructions

### Step 1: Make Sure MySQL is Running

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "MySQL" service
- Make sure it's "Running"

**Mac/Linux:**
```bash
sudo systemctl start mysql
# OR
brew services start mysql
```

### Step 2: Open MySQL Command Line

**Option A: Command Line**
```bash
mysql -u root -p
```
(Enter your MySQL root password when prompted)

**Option B: MySQL Workbench**
- Open MySQL Workbench
- Connect to your local MySQL server

### Step 3: Create Database and Tables

**Method 1: Using Command Line (Easiest)**

```bash
# From your project folder
cd oneflow-db
mysql -u root -p < complete-setup.sql
```
(Enter your MySQL root password)

**Method 2: Copy and Paste SQL**

1. Open `complete-setup.sql` in a text editor
2. Copy ALL the contents
3. Paste into MySQL command line or Workbench
4. Press Enter or Execute

### Step 4: Insert Sample Data

**Method 1: Using Command Line**

```bash
mysql -u root -p oneflow < insert-all-data-ready.sql
```
(Enter your MySQL root password)

**Method 2: Copy and Paste SQL**

1. Open `insert-all-data-ready.sql` in a text editor
2. Copy ALL the contents
3. Paste into MySQL command line or Workbench
4. Press Enter or Execute

### Step 5: Verify Everything Works

```sql
USE oneflow;

-- Check if tables were created
SHOW TABLES;

-- Check if data was inserted
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as projects FROM projects;
SELECT COUNT(*) as tasks FROM tasks;
```

You should see:
- 12 tables
- 5 users
- 2 projects
- 4 tasks

### Step 6: Test Connection

```bash
mysql -u oneflow_user -poneflow_password oneflow
```

If this works, your database is ready! ✅

## 📋 Complete Command Sequence

Copy and paste these commands one by one:

```bash
# 1. Navigate to database folder
cd oneflow-db

# 2. Create database and tables
mysql -u root -p < complete-setup.sql

# 3. Insert sample data
mysql -u root -p oneflow < insert-all-data-ready.sql

# 4. Verify connection
mysql -u oneflow_user -poneflow_password oneflow
```

## 🔑 Default Credentials

- **Database:** oneflow
- **User:** oneflow_user
- **Password:** oneflow_password
- **MySQL Root:** (your MySQL root password)

## ✅ Success Checklist

- [ ] MySQL is running
- [ ] Database `oneflow` created
- [ ] User `oneflow_user` created
- [ ] 12 tables created
- [ ] Sample data inserted (5 users, 2 projects, etc.)
- [ ] Can connect with: `mysql -u oneflow_user -poneflow_password oneflow`

## 🎯 Next Steps

After database is set up:

1. **Start Backend:**
   ```bash
   cd oneflow-api
   cp .env.example .env
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd oneflow-ui
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Test Login:**
   - Go to: http://localhost:5173
   - Login with: `admin@oneflow.com` / `password123`

## ❌ Troubleshooting

### "Access denied"
- Make sure you're using the correct MySQL root password
- Check if MySQL is running

### "Unknown database"
- Run `complete-setup.sql` first to create the database

### "Table already exists"
- Database already set up, skip to Step 4 (insert data)
- Or drop and recreate: `DROP DATABASE oneflow;` then run setup again

### "Cannot connect to MySQL"
- Make sure MySQL service is running
- Check if MySQL is on port 3306

## 📚 Need More Help?

- See `HOW-TO-INSERT.md` for detailed INSERT instructions
- See `README-SQL.md` for complete SQL documentation
- See `QUICK-START.md` for quick setup guide

