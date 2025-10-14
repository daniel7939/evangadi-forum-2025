const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');
const { register, login, check } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/check', authMiddleware, check);

module.exports = router;
