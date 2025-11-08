# PowerShell Script to Change Backend Server Port
# Usage: .\change-backend-port.ps1 -NewPort 3002

param(
    [Parameter(Mandatory=$false)]
    [int]$NewPort = 3001,
    
    [Parameter(Mandatory=$false)]
    [string]$BackendHost = "localhost",
    
    [Parameter(Mandatory=$false)]
    [string]$FrontendPort = "5173"
)

Write-Host "=== Changing Backend Server Configuration ===" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendEnvPath = Join-Path $projectRoot "oneflow-api\.env"
$frontendEnvPath = Join-Path $projectRoot "oneflow-ui\.env"

# Calculate API URL
$apiUrl = "http://${BackendHost}:${NewPort}"

Write-Host "New Configuration:" -ForegroundColor Yellow
Write-Host "  Backend Port: $NewPort" -ForegroundColor White
Write-Host "  Backend Host: $BackendHost" -ForegroundColor White
Write-Host "  API URL: $apiUrl" -ForegroundColor White
Write-Host ""

# Update Backend .env
Write-Host "Updating backend configuration..." -ForegroundColor Yellow
if (Test-Path $backendEnvPath) {
    $backendContent = Get-Content $backendEnvPath -Raw
    $backendContent = $backendContent -replace 'PORT=\d+', "PORT=$NewPort"
    
    # Update CORS origin if it exists
    if ($backendContent -match 'CORS_ORIGIN=') {
        $frontendUrl = "http://localhost:${FrontendPort}"
        $backendContent = $backendContent -replace 'CORS_ORIGIN=.*', "CORS_ORIGIN=$frontendUrl"
    } else {
        $frontendUrl = "http://localhost:${FrontendPort}"
        $backendContent += "`nCORS_ORIGIN=$frontendUrl"
    }
    
    $backendContent | Set-Content $backendEnvPath -NoNewline
    Write-Host "  ✅ Backend .env updated" -ForegroundColor Green
} else {
    # Create new .env file
    $backendEnvContent = @"
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow
DB_USER=oneflow_user
DB_PASSWORD=oneflow_password

# JWT Configuration
JWT_SECRET=oneflow-super-secret-jwt-key-for-development-change-in-production-min-32-chars-long
JWT_REFRESH_SECRET=oneflow-super-secret-refresh-key-for-development-change-in-production-min-32-chars-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=$NewPort
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:$FrontendPort

# Logging Configuration
LOG_LEVEL=info
"@
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding utf8
    Write-Host "  ✅ Created backend .env file" -ForegroundColor Green
}

# Update Frontend .env
Write-Host "Updating frontend configuration..." -ForegroundColor Yellow
if (Test-Path $frontendEnvPath) {
    $frontendContent = Get-Content $frontendEnvPath -Raw
    if ($frontendContent -match 'VITE_API_URL=') {
        $frontendContent = $frontendContent -replace 'VITE_API_URL=.*', "VITE_API_URL=$apiUrl"
    } else {
        $frontendContent += "`nVITE_API_URL=$apiUrl"
    }
    $frontendContent | Set-Content $frontendEnvPath -NoNewline
    Write-Host "  ✅ Frontend .env updated" -ForegroundColor Green
} else {
    # Create new .env file
    "VITE_API_URL=$apiUrl" | Out-File -FilePath $frontendEnvPath -Encoding utf8
    Write-Host "  ✅ Created frontend .env file" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Configuration Updated Successfully ===" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Backend will run on: http://${BackendHost}:${NewPort}" -ForegroundColor White
Write-Host "  Frontend will connect to: $apiUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Restart backend server: cd oneflow-api && npm run dev" -ForegroundColor White
Write-Host "  2. Restart frontend server: cd oneflow-ui && npm run dev" -ForegroundColor White
Write-Host "  3. Test connection: Open http://localhost:$FrontendPort in browser" -ForegroundColor White
Write-Host ""

