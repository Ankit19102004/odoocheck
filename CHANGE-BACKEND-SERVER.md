# 🔧 How to Change Backend Server Configuration

## Current Configuration

- **Backend Port:** 3001 (default)
- **Backend URL:** `http://localhost:3001`
- **Frontend Port:** 5173 (default)
- **Frontend URL:** `http://localhost:5173`

---

## Option 1: Change Backend Port

### Step 1: Update Backend .env File

Create or update `oneflow-api/.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**To change port to 3002 (example):**
```env
PORT=3002
```

### Step 2: Update Frontend .env File

Create or update `oneflow-ui/.env`:

```env
VITE_API_URL=http://localhost:3002
```

**Important:** Change the port number to match the backend port.

### Step 3: Update CORS Settings

If you changed the port, make sure CORS allows the frontend URL:

In `oneflow-api/.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## Option 2: Change Backend Host/URL

### For Local Development

If you want to use a different host (e.g., `127.0.0.1`):

**Backend (`oneflow-api/.env`):**
```env
PORT=3001
CORS_ORIGIN=http://127.0.0.1:5173
```

**Frontend (`oneflow-ui/.env`):**
```env
VITE_API_URL=http://127.0.0.1:3001
```

### For Remote Server

If you want to connect to a remote backend server:

**Frontend (`oneflow-ui/.env`):**
```env
VITE_API_URL=http://your-server-ip:3001
# OR
VITE_API_URL=https://api.yourdomain.com
```

**Backend (`oneflow-api/.env`):**
```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
# Add your frontend URL to allowed origins
```

**Update Backend CORS Configuration:**

Edit `oneflow-api/src/index.ts` to add your frontend URL:

```typescript
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://your-frontend-url:5173', // Add your URL here
  'https://your-domain.com', // Add your production URL
];
```

---

## Option 3: Use Environment Variables

### Backend Environment Variables

Create `oneflow-api/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend Environment Variables

Create `oneflow-ui/.env`:

```env
VITE_API_URL=http://localhost:3001
```

---

## Quick Change Script

### PowerShell Script to Change Port

Create `change-backend-port.ps1`:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [int]$NewPort
)

# Update backend .env
$backendEnv = "oneflow-api\.env"
if (Test-Path $backendEnv) {
    $content = Get-Content $backendEnv
    $content = $content -replace 'PORT=\d+', "PORT=$NewPort"
    $content | Set-Content $backendEnv
    Write-Host "✅ Backend port updated to $NewPort"
} else {
    "PORT=$NewPort" | Out-File -FilePath $backendEnv -Encoding utf8
    Write-Host "✅ Created backend .env with port $NewPort"
}

# Update frontend .env
$frontendEnv = "oneflow-ui\.env"
$apiUrl = "http://localhost:$NewPort"
if (Test-Path $frontendEnv) {
    $content = Get-Content $frontendEnv
    if ($content -match 'VITE_API_URL=') {
        $content = $content -replace 'VITE_API_URL=.*', "VITE_API_URL=$apiUrl"
    } else {
        $content += "VITE_API_URL=$apiUrl"
    }
    $content | Set-Content $frontendEnv
    Write-Host "✅ Frontend API URL updated to $apiUrl"
} else {
    "VITE_API_URL=$apiUrl" | Out-File -FilePath $frontendEnv -Encoding utf8
    Write-Host "✅ Created frontend .env with API URL $apiUrl"
}

Write-Host "`n✅ Backend server configuration updated!"
Write-Host "   Backend will run on port: $NewPort"
Write-Host "   Frontend will connect to: $apiUrl"
Write-Host "`n⚠️  Remember to restart both backend and frontend servers!"
```

**Usage:**
```powershell
.\change-backend-port.ps1 -NewPort 3002
```

---

## Steps to Apply Changes

1. **Update Configuration Files**
   - Update `oneflow-api/.env` (backend port)
   - Update `oneflow-ui/.env` (frontend API URL)

2. **Restart Backend Server**
   ```powershell
   cd oneflow-api
   npm run dev
   ```

3. **Restart Frontend Server**
   ```powershell
   cd oneflow-ui
   npm run dev
   ```

4. **Verify Connection**
   - Open browser: `http://localhost:5173`
   - Check browser console for API connection
   - Test login functionality

---

## Common Issues

### Issue 1: CORS Error
**Problem:** Frontend can't connect to backend due to CORS.

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Update `allowedOrigins` in `oneflow-api/src/index.ts`
3. Restart backend server

### Issue 2: Connection Refused
**Problem:** Frontend shows "Cannot connect to server" error.

**Solution:**
1. Verify backend is running: `http://localhost:PORT/health`
2. Check `VITE_API_URL` in frontend `.env`
3. Make sure port numbers match
4. Check firewall settings

### Issue 3: Port Already in Use
**Problem:** Backend can't start because port is occupied.

**Solution:**
1. Find process using the port:
   ```powershell
   netstat -ano | findstr :3001
   ```
2. Kill the process or use a different port
3. Update `.env` files with new port

---

## Testing the Configuration

### Test Backend
```powershell
# Check if backend is running
curl http://localhost:3001/health

# Should return:
# {"status":"ok","message":"OneFlow API is running"}
```

### Test Frontend Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check if API requests are going to the correct URL

---

## Default Ports Reference

| Service | Default Port | Config File |
|---------|-------------|-------------|
| Backend API | 3001 | `oneflow-api/.env` (PORT) |
| Frontend UI | 5173 | `oneflow-ui/vite.config.ts` |
| MySQL | 3306 | `oneflow-api/.env` (DB_PORT) |

---

## Need Help?

If you're having issues changing the backend server:
1. Check all `.env` files exist
2. Verify port numbers match
3. Restart both servers
4. Check browser console for errors
5. Verify CORS settings

