# OneFlow Database - Local MySQL Setup

This directory contains all SQL scripts needed to manually set up the OneFlow database.

## 📁 Files

- **complete-setup.sql** - ⭐ **RECOMMENDED** - All-in-one setup (database + tables)
- **01-create-database.sql** - Create database and user only
- **02-create-tables.sql** - Create all tables
- **03-seed-data.sql** - Insert sample data (requires password hash generation)
- **setup-local-mysql.sql** - Quick database/user setup
- **generate-password-hash.js** - Generate bcrypt password hashes
- **README-SQL.md** - Complete SQL setup guide

## 🚀 Quick Setup

### Easiest Method: Complete Setup + Seeder

1. **Run complete setup:**
   ```bash
   mysql -u root -p < oneflow-db/complete-setup.sql
   ```

2. **Run Sequelize seeder (handles password hashing):**
   ```bash
   cd oneflow-api
   npm run seed
   ```

### Manual Method: Step by Step

1. **Create database and user:**
   ```bash
   mysql -u root -p < oneflow-db/01-create-database.sql
   ```

2. **Create all tables:**
   ```bash
   mysql -u root -p < oneflow-db/02-create-tables.sql
   ```

3. **Generate password hashes and insert data:**
   ```bash
   # Generate hashes
   cd oneflow-db
   node generate-password-hash.js
   
   # Update 03-seed-data.sql with real hashes, then:
   mysql -u root -p < oneflow-db/03-seed-data.sql
   ```

## 📖 Detailed Guide

See **README-SQL.md** for complete documentation on all SQL files and manual setup options.

## Default Credentials

- **Database:** oneflow
- **User:** oneflow_user
- **Password:** oneflow_password
- **Host:** localhost
- **Port:** 3306 (default)

**Note:** Change these credentials in production!

## Running Migrations

After setting up the database, run migrations from the `oneflow-api` directory:

```bash
cd ../oneflow-api
npm run migrate
```

## Seeding Data

To populate the database with sample data:

```bash
cd ../oneflow-api
npm run seed
```

## Troubleshooting

### "Access denied for user"
- Make sure the user exists: `SELECT User FROM mysql.user WHERE User='oneflow_user';`
- Verify privileges: `SHOW GRANTS FOR 'oneflow_user'@'localhost';`

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check if MySQL is on port 3306
- Verify connection: `mysql -u oneflow_user -p oneflow`

### "Unknown database 'oneflow'"
- Run the setup script again
- Verify database exists: `SHOW DATABASES;`
