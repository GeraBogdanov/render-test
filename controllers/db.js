// Use the MariaDB Node.js Connector
var mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config({ path: '.env-local' });

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'test',
  connectionLimit: 5,
});

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool,
});
