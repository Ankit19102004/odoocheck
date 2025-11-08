# Quick Database Connection Test
# This script tests if you can connect to MySQL

Write-Host "=== Testing MySQL Connection ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if MySQL is available
Write-Host "Test 1: Checking MySQL..." -ForegroundColor Yellow
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlPath) {
    Write-Host "✓ MySQL found: $($mysqlPath.Source)" -ForegroundColor Green
    mysql --version
} else {
    Write-Host "✗ MySQL not found in PATH" -ForegroundColor Red
    Write-Host "  Try: C:\xampp\mysql\bin\mysql.exe --version" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Try to connect (no password for XAMPP)
Write-Host "Test 2: Testing connection (no password)..." -ForegroundColor Yellow
mysql -u root -e "SELECT VERSION();" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Connection successful!" -ForegroundColor Green
    mysql -u root -e "SELECT VERSION();"
} else {
    Write-Host "X Connection failed" -ForegroundColor Red
    Write-Host "  Try with password:" -ForegroundColor Yellow
    Write-Host "    mysql -u root -p" -ForegroundColor Gray
}

Write-Host ""

# Test 3: Check if database exists
Write-Host "Test 3: Checking if oneflow database exists..." -ForegroundColor Yellow
$dbOutput = mysql -u root -e "SHOW DATABASES LIKE 'oneflow';" 2>&1
if ($LASTEXITCODE -eq 0 -and $dbOutput -like "*oneflow*") {
    Write-Host "OK Database oneflow exists" -ForegroundColor Green
} else {
    Write-Host "X Database oneflow does not exist yet" -ForegroundColor Yellow
    Write-Host "  You need to run the setup first" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan

