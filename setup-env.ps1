# OneFlow Environment Setup Script
# This script creates .env files for backend and frontend

Write-Host "=== OneFlow Environment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (project root)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Backend .env file
$backendEnvPath = Join-Path $projectRoot "oneflow-api\.env"
$backendEnvContent = @"
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

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
"@

# Frontend .env file
$frontendEnvPath = Join-Path $projectRoot "oneflow-ui\.env"
$frontendEnvContent = @"
# API Configuration
VITE_API_URL=http://localhost:3001
"@

# Create backend .env
if (Test-Path $backendEnvPath) {
    Write-Host "⚠ Backend .env already exists: $backendEnvPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Skipping backend .env" -ForegroundColor Gray
    } else {
        $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding utf8
        Write-Host "✓ Created backend .env" -ForegroundColor Green
    }
} else {
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding utf8
    Write-Host "✓ Created backend .env" -ForegroundColor Green
}

# Create frontend .env
if (Test-Path $frontendEnvPath) {
    Write-Host "⚠ Frontend .env already exists: $frontendEnvPath" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Skipping frontend .env" -ForegroundColor Gray
    } else {
        $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding utf8
        Write-Host "✓ Created frontend .env" -ForegroundColor Green
    }
} else {
    $frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding utf8
    Write-Host "✓ Created frontend .env" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start backend:  cd oneflow-api && npm install && npm run dev" -ForegroundColor Gray
Write-Host "2. Start frontend: cd oneflow-ui && npm install && npm run dev" -ForegroundColor Gray
Write-Host "3. Open browser:   http://localhost:5173" -ForegroundColor Gray

