# ⚡ Quick Guide: Change Backend Server

## Current Configuration

- **Backend Port:** 3001
- **Backend URL:** `http://localhost:3001`
- **Frontend Port:** 5173
- **Frontend URL:** `http://localhost:5173`

---

## 🚀 Quick Change Options

### Option 1: Change Port Only (Easiest)

**Use the PowerShell script:**
```powershell
.\change-backend-port.ps1 -NewPort 3002
```

This will:
- ✅ Update backend port to 3002
- ✅ Update frontend API URL to `http://localhost:3002`
- ✅ Update CORS settings

**Then restart servers:**
```powershell
# Terminal 1: Backend
cd oneflow-api
npm run dev

# Terminal 2: Frontend
cd oneflow-ui
npm run dev
```

---

### Option 2: Manual Change

#### Step 1: Update Backend Port

Edit `oneflow-api/.env`:
```env
PORT=3002
```

#### Step 2: Update Frontend API URL

Edit `oneflow-ui/.env`:
```env
VITE_API_URL=http://localhost:3002
```

#### Step 3: Restart Servers

```powershell
# Stop current servers (Ctrl+C)
# Then restart:

# Terminal 1
cd oneflow-api
npm run dev

# Terminal 2
cd oneflow-ui
npm run dev
```

---

### Option 3: Change to Remote Server

#### Update Frontend Only

Edit `oneflow-ui/.env`:
```env
VITE_API_URL=http://your-server-ip:3001
# OR
VITE_API_URL=https://api.yourdomain.com
```

#### Update Backend CORS

Edit `oneflow-api/.env`:
```env
CORS_ORIGIN=http://localhost:5173
# Add your frontend URL if different
```

Edit `oneflow-api/src/index.ts` - Add your frontend URL to `allowedOrigins`:
```typescript
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://your-frontend-url:5173', // Add your URL
];
```

---

## 📋 Common Port Changes

### Change to Port 3002
```powershell
.\change-backend-port.ps1 -NewPort 3002
```

### Change to Port 5000
```powershell
.\change-backend-port.ps1 -NewPort 5000
```

### Change to Port 8000
```powershell
.\change-backend-port.ps1 -NewPort 8000
```

---

## ✅ Verify Changes

### 1. Check Backend is Running
```powershell
curl http://localhost:NEW_PORT/health
```

Should return:
```json
{"status":"ok","message":"OneFlow API is running"}
```

### 2. Check Frontend Connection
1. Open browser: `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Console tab
4. Look for: `API Base URL: http://localhost:NEW_PORT`

### 3. Test Login
- Try to login with test account
- Check Network tab for API calls
- Verify requests go to correct URL

---

## 🆘 Troubleshooting

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :3001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### CORS Error
1. Check `CORS_ORIGIN` in `oneflow-api/.env`
2. Verify frontend URL is in `allowedOrigins`
3. Restart backend server

### Connection Refused
1. Verify backend is running
2. Check port number matches in both `.env` files
3. Check firewall settings
4. Verify MySQL is running (backend needs database)

---

## 📝 Files Modified

When you change the backend server, these files are updated:

1. **Backend:** `oneflow-api/.env`
   - `PORT` - Backend server port
   - `CORS_ORIGIN` - Allowed frontend URL

2. **Frontend:** `oneflow-ui/.env`
   - `VITE_API_URL` - Backend API URL

3. **Backend Code:** `oneflow-api/src/index.ts`
   - Server listen configuration
   - CORS allowed origins (may need manual update for custom URLs)

---

## 🎯 Quick Reference

| What to Change | File | Variable |
|----------------|------|----------|
| Backend Port | `oneflow-api/.env` | `PORT` |
| Frontend API URL | `oneflow-ui/.env` | `VITE_API_URL` |
| CORS Origin | `oneflow-api/.env` | `CORS_ORIGIN` |
| Allowed Origins | `oneflow-api/src/index.ts` | `allowedOrigins` |

---

## 💡 Pro Tips

1. **Use the script:** The PowerShell script automates everything
2. **Check ports:** Make sure no other app is using the port
3. **Restart both:** Always restart both backend and frontend after changes
4. **Check logs:** Backend logs show the exact URL it's running on
5. **Test health endpoint:** Always test `/health` endpoint first

---

## 🔄 Revert Changes

To revert to default port 3001:
```powershell
.\change-backend-port.ps1 -NewPort 3001
```

Or manually edit:
- `oneflow-api/.env`: `PORT=3001`
- `oneflow-ui/.env`: `VITE_API_URL=http://localhost:3001`

---

## 📞 Need Help?

If you're having issues:
1. Check `CHANGE-BACKEND-SERVER.md` for detailed guide
2. Verify all `.env` files exist and are correct
3. Check backend logs for errors
4. Verify MySQL is running
5. Test backend health endpoint directly

