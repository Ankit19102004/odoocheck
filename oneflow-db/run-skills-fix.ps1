# PowerShell script to fix the skills migration error
# This adds the required_skills column to tasks table and creates user_skills table

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Skills Migration Error" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is accessible
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow

# Run the SQL script
Write-Host "Running fix-skills-migration.sql..." -ForegroundColor Yellow
Write-Host ""

Get-Content fix-skills-migration.sql | mysql -u root -p oneflow

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your backend server (if running)" -ForegroundColor White
    Write-Host "2. Refresh your browser" -ForegroundColor White
    Write-Host "3. Projects should now load correctly!" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ Error running migration" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. MySQL is running" -ForegroundColor White
    Write-Host "2. You have the correct MySQL root password" -ForegroundColor White
    Write-Host "3. The 'oneflow' database exists" -ForegroundColor White
    Write-Host ""
    Write-Host "You can also run the SQL manually in MySQL Workbench:" -ForegroundColor Yellow
    Write-Host "  - Open fix-skills-migration.sql" -ForegroundColor White
    Write-Host "  - Execute it" -ForegroundColor White
}

