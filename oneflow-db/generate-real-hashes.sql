-- ============================================
-- Generate Real Password Hashes
-- Run this Node.js command first to get real hashes:
-- ============================================

-- Option 1: Using Node.js command line
-- node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10));"

-- Option 2: Using the generate-password-hash.js script
-- cd oneflow-db
-- node generate-password-hash.js

-- Option 3: Using MySQL (if you have bcrypt function installed)
-- Note: MySQL doesn't have bcrypt built-in, so use Node.js method above

-- ============================================
-- After generating hashes, update insert-all-data.sql
-- Replace the password_hash values in the INSERT statements
-- ============================================

