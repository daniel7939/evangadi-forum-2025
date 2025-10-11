const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: 'localhost',
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    waitForConnections: true,

});
// Export the pool for use across the app. Do NOT execute queries or close the pool here.
// Let the modules that use the pool manage queries and lifecycle.
module.exports = pool;