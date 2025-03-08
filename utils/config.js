require('dotenv').config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const DATABASE = process.env.DB_NAME;
const PORT = process.env.PORT || 3001;


module.exports = {
  HOST,
  USER,
  DATABASE,
  PORT
}