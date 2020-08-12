const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
const logger = require("../config/winston");

// Create a pool
var pool = mysql.createPool({
  connectionLimit: 10,
  dateStrings: true,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

pool.on('connection', function (connection) {
  logger.info(`Connected to database '${dbConfig.DB}'`);
});

// Query to ensure connection settings are working correctly
pool.query('SELECT 1', (err) => {
  if (err) {
    logger.error(err.sqlMessage);
  }
});

module.exports = pool;
