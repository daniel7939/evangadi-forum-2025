const pool = require('../db/dbconfig');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ===== REGISTER =====
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  // 1️⃣ Validate input
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '⚠️ All fields are required.' });
  }

  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '❌ Password must be at least 8 characters.' });
  }

  try {
    // 2️⃣ Check if email exists
    const [existing] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: '❌ Email already exists.' });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert user
    const sql = `
      INSERT INTO users (username, firstname, lastname, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.promise().execute(sql, [username, firstname, lastname, email, hashedPassword]);

    res.status(StatusCodes.CREATED).json({ msg: '✅ User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '❌ Server error', error: err.message });
  }
}

// ===== LOGIN =====
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: '⚠️ Email and password are required.' });
  }

  try {
    const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: '❌ Email not found. Please register first.' });
    }

    const user = rows[0];
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '❌ Server error' });
  }
}

// ===== CHECK USER =====
async function check(req, res) {
  try {
    const [rows] = await pool.promise().query(
      'SELECT id, username, firstname, lastname, email FROM users WHERE email = ?',
      [req.user.email]
    );

    if (rows.length === 0) return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });

    res.status(StatusCodes.OK).json({ user: rows[0] });
  } catch (err) {
    console.error('Check user error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: '❌ Server error', error: err.message });
  }
}

module.exports = { register, login, check };
