const pool = require('../db/dbconfig'); // DB connection
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

// ✅ Use a default secret if not in .env (for local testing)
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// ===============================
// REGISTER USER
// ===============================
async function register(req, res) {
  const { username, email, firstname, lastname, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !firstname || !lastname || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: '⚠️ All required fields must be provided.' });
  }

  // 2️⃣ Password length check
  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: '❌ Password must be at least 8 characters long.' });
  }

  try {
    // 3️⃣ Check if email already exists
    const [existing] = await pool
      .promise()
      .query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: '❌ Email already exists. Please login instead.' });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Insert new user
    const sql = `
      INSERT INTO users (username, email, firstname, lastname, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.promise().execute(sql, [
      username || null,
      email,
      firstname,
      lastname,
      hashedPassword,
    ]);

    res.status(StatusCodes.CREATED).json({ msg: '✅ User registered successfully.' });
  } catch (error) {
    console.error('Register error:', error);

    // Duplicate entry error (DB-level)
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: '❌ Email already exists.' });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: '❌ Server error during registration.',
      error: error.sqlMessage || error.message,
    });
  }
}

// ===============================
// LOGIN USER
// ===============================
async function login(req, res) {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: '⚠️ Email and password are required.' });
  }

  try {
    // 2️⃣ Find user by email
    const [rows] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: '❌ Email not found. Please register first.' });
    }

    const user = rows[0];

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: '❌ Incorrect password.' });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5️⃣ Successful login response
    res.status(StatusCodes.OK).json({
      msg: '✅ Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: '❌ Server error during login.' });
  }
}

// ===============================
// CHECK SERVER
// ===============================
async function check(req, res) {
  res.send('✅ Server is running fine');
}

module.exports = {
  register,
  login,
  check,
};
