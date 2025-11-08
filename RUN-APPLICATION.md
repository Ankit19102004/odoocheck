# 🚀 How to Run OneFlow - Complete Step-by-Step Guide

## Prerequisites

Before starting, make sure you have:
- ✅ **MySQL** installed and running
- ✅ **Node.js 18+** installed
- ✅ **npm** (comes with Node.js)

## Step 1: Setup Database

### Option A: Using PowerShell Script (Windows - Easiest!)

```powershell
# Navigate to database folder
cd oneflow-db

# Run the setup script
.\run-setup.ps1
```

If you get an execution policy error, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option B: Using PowerShell Commands

```powershell
cd oneflow-db

# Step 1: Create database and tables
Get-Content complete-setup.sql | mysql -u root -p

# Step 2: Insert sample data
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### Option C: Using MySQL Workbench (Recommended for Windows!)

1. **Open MySQL Workbench**
2. **Connect to your MySQL server**
3. **Create Database and Tables:**
   - File → Open SQL Script
   - Select `oneflow-db/complete-setup.sql`
   - Click Execute (⚡ button)
4. **Insert Sample Data:**
   - File → Open SQL Script
   - Select `oneflow-db/insert-all-data-ready.sql`
   - Click Execute (⚡ button)

### Verify Database

```powershell
mysql -u oneflow_user -poneflow_password oneflow -e "SHOW TABLES;"
```

You should see 12 tables listed.

## Step 2: Setup Backend API

### Open a NEW terminal window

```powershell
# Navigate to backend folder
cd oneflow-api

# Copy environment file
Copy-Item .env.example .env

# Install dependencies (first time only, takes a few minutes)
npm install

# Start the backend server
npm run dev
```

**Wait for:** You should see:
```
✅ Database connection established successfully.
🚀 Server is running on port 3001
```

**Backend URL:** http://localhost:3001

**Keep this terminal open!** The server needs to keep running.

## Step 3: Setup Frontend

### Open ANOTHER NEW terminal window

```powershell
# Navigate to frontend folder
cd oneflow-ui

# Copy environment file
Copy-Item .env.example .env

# Install dependencies (first time only, takes a few minutes)
npm install

# Start the frontend server
npm run dev
```

**Wait for:** You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Frontend URL:** http://localhost:5173

**Keep this terminal open!** The server needs to keep running.

## Step 4: Access the Application

1. **Open your browser**
2. **Go to:** http://localhost:5173
3. **You should see the login page**

## Step 5: Login or Signup

### Option 1: Login with Test Account

- **Email:** `admin@oneflow.com`
- **Password:** `password123`

### Option 2: Create New Account

1. Click **"Sign up"** link
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
   - **Select your role** (Team Member, Project Manager, Sales/Finance, or Admin)
3. Click **"Sign up"**

## 📋 Complete Command Checklist

### Terminal 1: Database Setup
```powershell
cd oneflow-db
.\run-setup.ps1
# OR
Get-Content complete-setup.sql | mysql -u root -p
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

### Terminal 2: Backend (Keep Running)
```powershell
cd oneflow-api
Copy-Item .env.example .env
npm install
npm run dev
```

### Terminal 3: Frontend (Keep Running)
```powershell
cd oneflow-ui
Copy-Item .env.example .env
npm install
npm run dev
```

### Browser
- Open: http://localhost:5173
- Login: admin@oneflow.com / password123

## ✅ Success Indicators

You'll know everything is working when:

- [ ] ✅ Database: Can connect with `mysql -u oneflow_user -poneflow_password oneflow`
- [ ] ✅ Backend: See "🚀 Server is running on port 3001" in terminal
- [ ] ✅ Frontend: See "Local: http://localhost:5173/" in terminal
- [ ] ✅ Browser: Can access http://localhost:5173 and see login page
- [ ] ✅ Login: Can login with test account

## 🆘 Troubleshooting

### "MySQL not found"
- Make sure MySQL is installed
- Add MySQL to your PATH
- Or use full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

### "Access denied" (Database)
- Check your MySQL root password
- Make sure MySQL service is running (Windows Services)

### "Port 3001 already in use" (Backend)
- Close other applications using port 3001
- Or change PORT in `oneflow-api/.env`

### "Port 5173 already in use" (Frontend)
- Close other applications using port 5173
- Vite will automatically use next available port

### "Cannot connect to database" (Backend)
- Make sure MySQL is running
- Check credentials in `oneflow-api/.env`
- Verify database exists: `mysql -u oneflow_user -poneflow_password oneflow`

### "npm install fails"
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### "Module not found" errors
- Make sure you ran `npm install` in both `oneflow-api` and `oneflow-ui`
- Check if all dependencies are installed

## 🔄 Stopping the Application

1. **Stop Frontend:** Press `Ctrl+C` in Terminal 3
2. **Stop Backend:** Press `Ctrl+C` in Terminal 2
3. **Stop Database:** (Optional) Stop MySQL service if not needed

## 📚 Quick Reference

### URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

### Test Accounts
- **Admin:** admin@oneflow.com / password123
- **Manager:** manager@oneflow.com / password123
- **Team Member:** alice@oneflow.com / password123

### Database Credentials
- **Database:** oneflow
- **User:** oneflow_user
- **Password:** oneflow_password

## 🎯 Next Steps After Running

1. ✅ Login to the application
2. ✅ Explore the dashboard
3. ✅ View projects
4. ✅ Create a new project (as Project Manager or Admin)
5. ✅ Add tasks to projects
6. ✅ Use the Kanban board to manage tasks

## 💡 Tips

- **Keep 3 terminals open:** Database setup (optional), Backend, Frontend
- **First time setup:** `npm install` may take 5-10 minutes
- **Subsequent runs:** Just use `npm run dev` (no need to install again)
- **Database:** Only need to setup once (unless you reset it)

