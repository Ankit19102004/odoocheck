# 🚀 START HERE - How to Run OneFlow

**👉 For detailed step-by-step instructions, see [RUN-APPLICATION.md](RUN-APPLICATION.md)**

## 📋 Prerequisites

- ✅ MySQL installed and running
- ✅ Node.js 18+ installed
- ✅ Git (optional)

## 🗄️ Step 1: Setup Database

### Option A: PowerShell Script (Windows - Easiest!)

```powershell
cd oneflow-db
.\run-setup.ps1
```

### Option B: PowerShell Commands (Windows)

```powershell
cd oneflow-db

# Create database and tables
Get-Content complete-setup.sql | mysql -u root -p

# Insert sample data
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### Option C: MySQL Workbench (Windows - Recommended!)

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `complete-setup.sql` → Execute
4. File → Open SQL Script → Select `insert-all-data-ready.sql` → Execute

### Option D: Bash/Command Line (Linux/Mac)

```bash
cd oneflow-db
mysql -u root -p < complete-setup.sql
mysql -u root -p oneflow < insert-all-data-ready.sql
```

### Option B: Manual Setup

1. **Open MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE oneflow;
   CREATE USER 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password';
   GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run table creation:**
   - Open `oneflow-db/complete-setup.sql`
   - Copy all contents
   - Paste into MySQL
   - Press Enter

4. **Insert data:**
   - Open `oneflow-db/insert-all-data-ready.sql`
   - Copy all contents
   - Paste into MySQL
   - Press Enter

### Verify Database

```bash
mysql -u oneflow_user -poneflow_password oneflow
```

If you can connect, database is ready! ✅

## 🔧 Step 2: Setup Backend

```bash
cd oneflow-api

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start server
npm run dev
```

Backend runs on: http://localhost:3001

## 🎨 Step 3: Setup Frontend

Open a **NEW terminal window**:

```bash
cd oneflow-ui

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start server
npm run dev
```

Frontend runs on: http://localhost:5173

## 🎉 Step 4: Access Application

1. Open browser: http://localhost:5173
2. Login with:
   - **Email:** `admin@oneflow.com`
   - **Password:** `password123`

## 📊 Test Accounts

- **Admin:** admin@oneflow.com / password123
- **Manager:** manager@oneflow.com / password123
- **Team Member:** alice@oneflow.com / password123

## ✅ Complete Setup Checklist

- [ ] MySQL is running
- [ ] Database `oneflow` created
- [ ] Tables created (12 tables)
- [ ] Sample data inserted
- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Can login to application

## 🆘 Troubleshooting

### MySQL not running?
- **Windows:** Open Services, find MySQL, start it
- **Mac/Linux:** `sudo systemctl start mysql`

### "Access denied" error?
- Check your MySQL root password
- Make sure MySQL is running

### "Port already in use"?
- Stop other applications using ports 3001 or 5173
- Or change ports in `.env` files

### Can't connect to database?
- Verify MySQL is running
- Check credentials in `oneflow-api/.env`
- Test connection: `mysql -u oneflow_user -poneflow_password oneflow`

## 📚 More Help

- **Database Setup:** See `oneflow-db/RUN-ME-FIRST.md`
- **SQL Files:** See `oneflow-db/HOW-TO-INSERT.md`
- **API Documentation:** See `README.md`

## 🎯 Quick Command Summary

```bash
# 1. Database
cd oneflow-db
mysql -u root -p < complete-setup.sql
mysql -u root -p oneflow < insert-all-data-ready.sql

# 2. Backend (Terminal 1)
cd oneflow-api
npm install
npm run dev

# 3. Frontend (Terminal 2 - NEW)
cd oneflow-ui
npm install
npm run dev

# 4. Open browser
# http://localhost:5173
# Login: admin@oneflow.com / password123
```

