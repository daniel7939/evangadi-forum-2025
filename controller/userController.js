const pool = require('../db/dbconfig');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ===== REGISTER =====
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '⚠️ All fields are required.' });
  }

  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '❌ Password must be at least 8 characters.' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: '❌ Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email
    `;
    const result = await pool.query(sql, [username, firstname, lastname, email, hashedPassword]);

    res.status(StatusCodes.CREATED).json({ 
      msg: '✅ User registered successfully.',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.response?.data?.msg || "Registration failed. Try again.", error: err.message });
  }
}

// ===== LOGIN =====
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '⚠️ Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '❌ Email not found. Please register first.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '❌ Incorrect password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(StatusCodes.OK).json({
      msg: '✅ Login successful.',
      token,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '❌ Server error', error: err.message });
  }
}

// ===== CHECK USER =====
async function check(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '❌ Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query(
      'SELECT id, username, firstname, lastname, email FROM users WHERE email=$1',
      [decoded.email]
    );
    if (result.rows.length === 0) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });

    res.status(StatusCodes.OK).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Check user error:', err);
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: '❌ Invalid token' });
  }
}

module.exports = { register, login, check };
