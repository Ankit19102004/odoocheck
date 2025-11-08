# ⚡ Quick Run Guide - OneFlow

## 🎯 3 Simple Steps

### Step 1: Setup Database (One Time)

**Choose ONE method:**

#### Method A: PowerShell Script
```powershell
cd oneflow-db
.\run-setup.ps1
```

#### Method B: MySQL Workbench (Easiest!)
1. Open MySQL Workbench
2. File → Open SQL Script → `complete-setup.sql` → Execute
3. File → Open SQL Script → `insert-all-data-ready.sql` → Execute

#### Method C: PowerShell Commands
```powershell
cd oneflow-db
Get-Content complete-setup.sql | mysql -u root -p
Get-Content insert-all-data-ready.sql | mysql -u root -p oneflow
```

---

### Step 2: Start Backend

**Open Terminal 1:**
```powershell
cd oneflow-api
Copy-Item .env.example .env
npm install
npm run dev
```

**Wait for:** `🚀 Server is running on port 3001`

---

### Step 3: Start Frontend

**Open Terminal 2 (NEW terminal):**
```powershell
cd oneflow-ui
Copy-Item .env.example .env
npm install
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

---

## 🌐 Open Browser

Go to: **http://localhost:5173**

**Login with:**
- Email: `admin@oneflow.com`
- Password: `password123`

---

## ✅ That's It!

You now have:
- ✅ Database running
- ✅ Backend API running on port 3001
- ✅ Frontend running on port 5173
- ✅ Application ready to use!

---

## 📝 Notes

- **First time:** `npm install` takes 5-10 minutes
- **Next times:** Just run `npm run dev` (no install needed)
- **Keep terminals open:** Both backend and frontend need to stay running
- **Database:** Only setup once (unless you reset it)

## 🆘 Problems?

See [RUN-APPLICATION.md](RUN-APPLICATION.md) for detailed troubleshooting.

