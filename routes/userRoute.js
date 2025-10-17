const express = require('express');
const router = express.Router();
const { register, login, check } = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/check', check);

module.exports = router;
