// Load environment variables as early as possible
require('dotenv').config();

const express = require('express');
const app = express();
const port = 5500;

// Database connection
const pool = require('./db/dbconfig');

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoute');
app.use('/api/users', userRoutes);

const questionRoutes = require('./routes/questionRouter');
app.use('/api/questions', questionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('✅ Server is up and running');
});

// Start server only after DB connection check
async function start() {
  try {
    await pool.promise().query('SELECT 1');
    console.log('✅ Connected to MySQL database');
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    process.exit(1);
  }
}

start();

module.exports = app;