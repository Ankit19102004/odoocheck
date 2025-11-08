// Test login with admin user
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

async function testLogin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const users = await sequelize.query(
      `SELECT id, email, password_hash FROM users WHERE email = 'admin@oneflow.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users && users.length > 0) {
      const user = users[0];
      const password = 'password123';
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      console.log('✅ User found:', user.email);
      console.log('✅ Password test:', isValid ? 'PASSED ✓' : 'FAILED ✗');
      
      if (isValid) {
        console.log('✅ Login should work!');
        console.log('   Email: admin@oneflow.com');
        console.log('   Password: password123');
      } else {
        console.log('❌ Password verification failed!');
        console.log('   Run: node fix-passwords.js');
      }
    } else {
      console.log('❌ User not found!');
    }

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();

