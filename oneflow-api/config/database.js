require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'oneflow_user',
    password: process.env.DB_PASSWORD || 'oneflow_password',
    database: process.env.DB_NAME || 'oneflow',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  },
  test: {
    username: process.env.DB_USER || 'oneflow_user',
    password: process.env.DB_PASSWORD || 'oneflow_password',
    database: process.env.DB_NAME || 'oneflow',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
};

