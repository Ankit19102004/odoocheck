# 🔧 Fix "Unknown column 'tasks.required_skills'" Error

## Quick Fix

Run this SQL script to add the missing database columns:

### Option 1: Using PowerShell Script (Windows - Easiest!)

```powershell
cd oneflow-db
.\run-skills-fix.ps1
```

If you get an execution policy error, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 2: Using MySQL Command Line

```bash
mysql -u root -p oneflow < oneflow-db/fix-skills-migration.sql
```

### Option 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Select `oneflow-db/fix-skills-migration.sql`
5. Click Execute (⚡ button)

### Option 4: Copy and Paste SQL

1. Open `oneflow-db/fix-skills-migration.sql` in a text editor
2. Copy ALL the contents
3. Paste into MySQL command line or Workbench
4. Press Enter or Execute

## What This Script Does

1. ✅ Adds `required_skills` column to `tasks` table
2. ✅ Creates `user_skills` table for skill management
3. ✅ Verifies the changes were applied

## After Running the Script

1. Restart your backend server (if it's running)
2. Refresh your browser
3. Projects should now load successfully!

## Alternative: Using Sequelize Migrations

If you prefer using Sequelize migrations:

```bash
cd oneflow-api
npm run migrate
```

This will run all pending migrations including the skills migration.

