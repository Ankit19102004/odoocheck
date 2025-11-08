// Fix user passwords in database
// This script updates all users with correct bcrypt password hashes

const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'oneflow',
  process.env.DB_USER || 'oneflow_user',
  process.env.DB_PASSWORD || 'oneflow_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
  }
);

async function fixPasswords() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Generate password hash
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Generated password hash:', hash.substring(0, 30) + '...');

    // Update all users
    const [updated] = await sequelize.query(
      `UPDATE users SET password_hash = :hash WHERE id > 0`,
      {
        replacements: { hash },
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    console.log('✅ Updated password for all users');
    console.log('✅ Password for all users: password123');
    console.log('✅ Login credentials:');
    console.log('   - admin@oneflow.com / password123');
    console.log('   - manager@oneflow.com / password123');
    console.log('   - alice@oneflow.com / password123');
    console.log('   - bob@oneflow.com / password123');
    console.log('   - carol@oneflow.com / password123');

    // Verify one password
    const [users] = await sequelize.query(
      `SELECT id, email, password_hash FROM users WHERE email = 'admin@oneflow.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users && users.length > 0) {
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      console.log('✅ Password verification test:', isValid ? 'PASSED' : 'FAILED');
    }

    await sequelize.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixPasswords();

