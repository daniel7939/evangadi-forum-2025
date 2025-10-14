const mysql2 = require('mysql2');

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',         // Your MAMP MySQL user
  password: 'root',     // Your MAMP MySQL password
  database: 'evangadi-dbb', // Your database name
  waitForConnections: true,
});

module.exports = pool;
