# Quick Start - Manual MySQL Setup

## 🚀 Fastest Way to Setup Database

### Method 1: Complete Setup (Recommended)

```bash
# 1. Run complete setup (creates database + all tables)
mysql -u root -p < oneflow-db/complete-setup.sql

# 2. Run Sequelize seeder (inserts data with proper password hashes)
cd oneflow-api
npm install  # if not already installed
npm run seed
```

**Done!** Your database is ready with sample data.

### Method 2: Step by Step Manual Setup

#### Step 1: Create Database
```bash
mysql -u root -p < oneflow-db/01-create-database.sql
```

#### Step 2: Create Tables
```bash
mysql -u root -p < oneflow-db/02-create-tables.sql
```

#### Step 3: Generate Password Hashes
```bash
cd oneflow-db
node generate-password-hash.js
```

Copy the generated hashes.

#### Step 4: Update Seed Data
Edit `03-seed-data.sql` and replace `REPLACE_WITH_REAL_HASH` with the actual hashes.

#### Step 5: Insert Data
```bash
mysql -u root -p < oneflow-db/03-seed-data.sql
```

## 📝 What Each File Does

- **complete-setup.sql** - Creates database, user, and all tables (no data)
- **01-create-database.sql** - Creates database and user only
- **02-create-tables.sql** - Creates all 12 tables
- **03-seed-data.sql** - Inserts sample data (needs password hashes)
- **generate-password-hash.js** - Generates bcrypt hashes for passwords

## ✅ Verify Setup

```bash
# Test connection
mysql -u oneflow_user -poneflow_password oneflow

# Check tables
SHOW TABLES;

# Check users
SELECT COUNT(*) FROM users;

# Check projects
SELECT COUNT(*) FROM projects;
```

## 🔑 Default Test Accounts

After running the seeder:
- **Admin:** admin@oneflow.com / password123
- **Manager:** manager@oneflow.com / password123
- **Team Member:** alice@oneflow.com / password123

## 📚 More Info

See `README-SQL.md` for detailed documentation.

