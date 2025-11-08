# OneFlow Database Setup Script for PowerShell
# Run this script to set up the database

Write-Host "=== OneFlow Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is available
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Host "ERROR: MySQL command not found!" -ForegroundColor Red
    Write-Host "Please make sure MySQL is installed and in your PATH." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ MySQL found" -ForegroundColor Green
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$setupFile = Join-Path $scriptDir "complete-setup.sql"
$insertFile = Join-Path $scriptDir "insert-all-data-ready.sql"

# Check if files exist
if (-not (Test-Path $setupFile)) {
    Write-Host "ERROR: complete-setup.sql not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $insertFile)) {
    Write-Host "ERROR: insert-all-data-ready.sql not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Creating database and tables..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL root password when prompted" -ForegroundColor Gray
Write-Host ""

# Run setup script
Get-Content $setupFile | mysql -u root -p

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Database and tables created successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 2: Inserting sample data..." -ForegroundColor Yellow
    Write-Host "Please enter your MySQL root password when prompted again" -ForegroundColor Gray
    Write-Host ""
    
    # Run insert script
    Get-Content $insertFile | mysql -u root -p oneflow
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Sample data inserted successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Test connection:" -ForegroundColor Yellow
        Write-Host "  mysql -u oneflow_user -poneflow_password oneflow" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Test accounts:" -ForegroundColor Yellow
        Write-Host "  admin@oneflow.com / password123" -ForegroundColor Gray
        Write-Host "  manager@oneflow.com / password123" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "✗ Failed to insert data" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}

