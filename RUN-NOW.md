# 🚀 Run OneFlow Now - Step by Step

## ✅ Database Status: READY!
Your database is already set up with:
- ✅ Database: `oneflow`
- ✅ 12 tables created
- ✅ Sample data inserted (5 users, 2 projects, etc.)

---

## Step 1: Start Backend API

### Open a NEW terminal window

```powershell
# Navigate to backend folder
cd C:\Users\Hp\Desktop\odoof\oneflow-api

# Check if .env file exists
Test-Path .env
```

**If .env doesn't exist, create it:**

**Option 1: Use the setup script (Easiest!)**
```powershell
# From project root
cd C:\Users\Hp\Desktop\odoof
.\setup-env.ps1
```

**Option 2: Create manually**
```powershell
@"
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding utf8
```

**Install dependencies (first time only):**
```powershell
npm install
```

**Start the backend:**
```powershell
npm run dev
```

**✅ Success:** You should see:
```
✅ Database connection established successfully.
🚀 Server is running on port 3001
```

**⚠️ Keep this terminal open!** The backend must keep running.

---

## Step 2: Start Frontend

### Open ANOTHER NEW terminal window

```powershell
# Navigate to frontend folder
cd C:\Users\Hp\Desktop\odoof\oneflow-ui

# Check if .env file exists
Test-Path .env
```

**If .env doesn't exist, create it:**

**Option 1: Use the setup script (Easiest!)**
```powershell
# From project root
cd C:\Users\Hp\Desktop\odoof
.\setup-env.ps1
```

**Option 2: Create manually**
```powershell
@"
VITE_API_URL=http://localhost:3001
"@ | Out-File -FilePath .env -Encoding utf8
```

**Install dependencies (first time only):**
```powershell
npm install
```

**Start the frontend:**
```powershell
npm run dev
```

**✅ Success:** You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**⚠️ Keep this terminal open!** The frontend must keep running.

---

## Step 3: Open Browser

1. **Open your browser**
2. **Go to:** http://localhost:5173
3. **You should see the login page**

---

## Step 4: Login

**Use test account:**
- **Email:** `admin@oneflow.com`
- **Password:** `password123`

**⚠️ If login fails:** See [LOGIN-FIXED.md](LOGIN-FIXED.md) for troubleshooting.

---

## ✅ That's It!

You should now have:
- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:5173
- ✅ Application ready to use!

---

## 🆘 Common Errors

### Error: "Cannot connect to database"
**Solution:** Check `oneflow-api/.env` file has correct credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password
```

### Error: "Module not found"
**Solution:** Run `npm install` in the folder showing the error:
```powershell
cd oneflow-api
npm install
# OR
cd oneflow-ui
npm install
```

### Error: "Port 3001 already in use"
**Solution:** Another app is using port 3001. Either:
1. Close the other app
2. Or change PORT in `oneflow-api/.env` to `3002`

### Error: "Port 5173 already in use"
**Solution:** Vite will automatically use the next available port. Check the terminal output for the new port number.

### Error: "npm install" takes too long
**Solution:** This is normal for the first time. It can take 5-10 minutes. Be patient!

---

## 📋 Quick Command Reference

### Terminal 1: Backend
```powershell
cd C:\Users\Hp\Desktop\odoof\oneflow-api
npm install
npm run dev
```

### Terminal 2: Frontend
```powershell
cd C:\Users\Hp\Desktop\odoof\oneflow-ui
npm install
npm run dev
```

### Browser
- URL: http://localhost:5173
- Login: admin@oneflow.com / password123

---

## 🎯 Next Steps

1. ✅ Login to the application
2. ✅ Explore the dashboard
3. ✅ View projects
4. ✅ Create a new project
5. ✅ Add tasks to projects
6. ✅ Use the Kanban board

---

## 💡 Tips

- **First time:** `npm install` takes 5-10 minutes (this is normal!)
- **Next times:** Just run `npm run dev` (no install needed)
- **Keep terminals open:** Both backend and frontend must stay running
- **Database:** Already set up! ✅ No need to do anything with it.

---

## Still Having Issues?

**Tell me:**
1. What exact error message do you see?
2. Which step failed? (Backend / Frontend / Browser)
3. What terminal output do you see?

