const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const { register, login, check } = require('../controller/userController');

// Register new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Check user token validity (protected route)
router.get('/check', authMiddleware, check);

module.exports = router;
