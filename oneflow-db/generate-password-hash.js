// ============================================
// Password Hash Generator for OneFlow
// Run this to generate bcrypt hashes for user passwords
// ============================================
//
// IMPORTANT: Run this from the oneflow-api directory where bcryptjs is installed
// cd ../oneflow-api
// node ../oneflow-db/generate-password-hash.js
//
// OR use this command directly:
// cd oneflow-api
// node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10));"
// ============================================

try {
  const bcrypt = require('bcryptjs');

  const password = 'password123';
  const hash = bcrypt.hashSync(password, 10);

  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n=== Use this hash for all users ===\n');

  // Generate hashes for all users
  console.log('=== All User Hashes (same password) ===');
  const users = [
    { email: 'admin@oneflow.com', password: 'password123' },
    { email: 'manager@oneflow.com', password: 'password123' },
    { email: 'alice@oneflow.com', password: 'password123' },
    { email: 'bob@oneflow.com', password: 'password123' },
    { email: 'carol@oneflow.com', password: 'password123' },
  ];

  users.forEach(user => {
    const userHash = bcrypt.hashSync(user.password, 10);
    console.log(`${user.email}: ${userHash}`);
  });

  console.log('\n=== SQL UPDATE Statement ===');
  console.log('UPDATE users SET password_hash = \'' + hash + '\' WHERE email IN (');
  console.log("  'admin@oneflow.com',");
  console.log("  'manager@oneflow.com',");
  console.log("  'alice@oneflow.com',");
  console.log("  'bob@oneflow.com',");
  console.log("  'carol@oneflow.com'");
  console.log(');');
} catch (error) {
  console.error('Error: bcryptjs not found!');
  console.error('\nRun this from oneflow-api directory:');
  console.error('  cd ../oneflow-api');
  console.error('  node ../oneflow-db/generate-password-hash.js');
  console.error('\nOr use this command:');
  console.error('  cd oneflow-api');
  console.error('  node -e "const bcrypt = require(\'bcryptjs\'); console.log(bcrypt.hashSync(\'password123\', 10));"');
}

