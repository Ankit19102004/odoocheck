# 🔧 Fix: Backend Server Not Running Error

## Error Message
```
Network error: Cannot connect to server. 
Please make sure the backend is running on http://localhost:3001
```

## Solution: Start the Backend Server

### Step 1: Open a New Terminal Window

**Open PowerShell or Command Prompt** (keep it open!)

### Step 2: Navigate to Backend Folder

```powershell
cd C:\Users\Hp\Desktop\odoof2\oneflow-api
```

### Step 3: Start the Backend Server

```powershell
npm run dev
```

### Step 4: Wait for Success Message

You should see:
```
✅ Database connection established successfully.
🚀 Server is running on port 3001
```

### Step 5: Keep Terminal Open

**⚠️ IMPORTANT:** Keep this terminal window open! The backend server must keep running.

---

## If You Get Errors

### Error: "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Error: "Cannot connect to database"
- Make sure MySQL is running
- Check database credentials in `oneflow-api/.env` file

### Error: "Port 3001 already in use"
- Another process is using port 3001
- Close that process or change the port in `.env` file

---

## Verify Backend is Running

Open a browser and go to: **http://localhost:3001/health**

You should see:
```json
{"status":"ok","message":"OneFlow API is running"}
```

---

## Next Steps

Once the backend is running:
1. ✅ Backend server running on port 3001
2. ✅ Refresh your browser
3. ✅ Try logging in again

---

## Quick Command Reference

```powershell
# Start backend (Terminal 1)
cd C:\Users\Hp\Desktop\odoof2\oneflow-api
npm run dev

# Start frontend (Terminal 2 - NEW terminal)
cd C:\Users\Hp\Desktop\odoof2\oneflow-ui
npm run dev
```

Both terminals must stay open!

