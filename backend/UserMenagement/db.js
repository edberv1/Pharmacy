const mysql = require('mysql');
const runMigrations = require('./migrations.js');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the connection limit as needed
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pharmacy'
});

// Export the pool
module.exports = pool;

// Run migrations
runMigrations(pool);
