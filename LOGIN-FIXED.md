# ✅ Login Issue Fixed!

## Problem
The login was failing because password hashes in the database were invalid/truncated.

## Solution Applied
✅ **Fixed all user passwords in the database**  
✅ **All users now have correct bcrypt password hashes**  
✅ **Password verification test: PASSED ✓**

## Login Credentials

**All users use the same password:** `password123`

### Test Accounts:
- **Admin:** `admin@oneflow.com` / `password123`
- **Project Manager:** `manager@oneflow.com` / `password123`
- **Team Member:** `alice@oneflow.com` / `password123`
- **Team Member:** `bob@oneflow.com` / `password123`
- **Sales/Finance:** `carol@oneflow.com` / `password123`

---

## Next Steps

### 1. Make Sure Backend is Running

```powershell
cd C:\Users\Hp\Desktop\odoof\oneflow-api
npm run dev
```

**You should see:**
```
✅ Database connection established successfully.
🚀 Server is running on port 3001
```

### 2. Make Sure Frontend is Running

**Open a NEW terminal:**
```powershell
cd C:\Users\Hp\Desktop\odoof\oneflow-ui
npm run dev
```

**You should see:**
```
Local: http://localhost:5173/
```

### 3. Try Login Again

1. **Open browser:** http://localhost:5173
2. **Login with:**
   - Email: `admin@oneflow.com`
   - Password: `password123`

---

## If Login Still Doesn't Work

### Check 1: Backend is Running
- Look at backend terminal
- Should see: "🚀 Server is running on port 3001"
- If not, start it: `cd oneflow-api && npm run dev`

### Check 2: Frontend is Running
- Look at frontend terminal
- Should see: "Local: http://localhost:5173/"
- If not, start it: `cd oneflow-ui && npm run dev`

### Check 3: Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Check 4: Test API Directly

**Using PowerShell:**
```powershell
$body = @{
    email = "admin@oneflow.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

**Or using curl (if installed):**
```powershell
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@oneflow.com\",\"password\":\"password123\"}"
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

## Test Scripts

### Test Password Verification
```powershell
cd oneflow-api
node test-login.js
```

**Should show:** `✅ Password test: PASSED ✓`

### Fix Passwords (if needed)
```powershell
cd oneflow-api
node fix-passwords.js
```

---

## Common Issues

### Issue: "Cannot connect to database"
**Solution:** Make sure MySQL is running
```powershell
Get-Service | Where-Object {$_.Name -like "*mysql*"}
```

### Issue: "Port 3001 already in use"
**Solution:** Close other apps using port 3001, or change PORT in `.env`

### Issue: "Port 5173 already in use"
**Solution:** Vite will auto-use next available port (check terminal output)

### Issue: CORS errors
**Solution:** Make sure `CORS_ORIGIN` in `oneflow-api/.env` is `http://localhost:5173`

---

## ✅ Status

- ✅ Database connected
- ✅ User passwords fixed
- ✅ Password verification: PASSED
- ✅ Backend API: Ready
- ✅ Frontend: Ready
- ✅ Login: Should work now!

**Try logging in again!** 🚀

---

## Still Having Issues?

1. **Check backend logs** - Look for error messages
2. **Check browser console** - Look for JavaScript errors
3. **Check network tab** - Look for failed API requests
4. **Tell me:**
   - What error message do you see?
   - What happens when you try to login?
   - Any errors in backend terminal?
   - Any errors in browser console?

