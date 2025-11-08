# Quick MySQL Status Check and Connection Test
# This script checks if MySQL is running and tests the connection

Write-Host "=== MySQL Status Check ===" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL process is running
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if ($mysqlProcess) {
    Write-Host "✅ MySQL process is running (PID: $($mysqlProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL process is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start MySQL:" -ForegroundColor Yellow
    Write-Host "  1. Open XAMPP Control Panel" -ForegroundColor White
    Write-Host "  2. Click 'Start' next to MySQL" -ForegroundColor White
    Write-Host "  3. Wait for it to show 'Running' (green)" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Test MySQL connection
Write-Host "Testing MySQL connection..." -ForegroundColor Yellow
$connectionTest = mysql -u root -e "SELECT VERSION();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
    $connectionTest
} else {
    Write-Host "❌ MySQL connection failed" -ForegroundColor Red
    Write-Host "Error: $connectionTest" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure MySQL is running in XAMPP Control Panel" -ForegroundColor White
    Write-Host "  - Try: mysql -u root (without password)" -ForegroundColor White
    Write-Host "  - Check if port 3306 is available" -ForegroundColor White
    exit 1
}

Write-Host ""

# Check if oneflow database exists
Write-Host "Checking if 'oneflow' database exists..." -ForegroundColor Yellow
$dbCheck = mysql -u root -e "SHOW DATABASES LIKE 'oneflow';" 2>&1
if ($dbCheck -like "*oneflow*") {
    Write-Host "✅ Database 'oneflow' exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database 'oneflow' does not exist" -ForegroundColor Yellow
    Write-Host "   You may need to run the database setup" -ForegroundColor White
    Write-Host "   See: oneflow-db/complete-setup.sql" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Check Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If everything is OK, you can now start the backend:" -ForegroundColor Green
Write-Host "  cd oneflow-api" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White

