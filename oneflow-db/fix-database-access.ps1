# Fix Database Access Issue
# This script fixes the "Access denied" error for oneflow_user

Write-Host "=== Fixing Database Access ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Fixing user permissions..." -ForegroundColor Yellow
mysql -u root -e "GRANT ALL PRIVILEGES ON oneflow.* TO 'oneflow_user'@'localhost' IDENTIFIED BY 'oneflow_password'; FLUSH PRIVILEGES;" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Permissions updated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to update permissions" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Testing connection..." -ForegroundColor Yellow
$testResult = mysql -u oneflow_user -poneflow_password oneflow -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='oneflow';" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Connection successful!" -ForegroundColor Green
    Write-Host "  $testResult" -ForegroundColor Gray
} else {
    Write-Host "✗ Connection failed" -ForegroundColor Red
    Write-Host "  Error: $testResult" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Fix Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now start the backend:" -ForegroundColor Yellow
Write-Host "  cd ..\oneflow-api" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray

