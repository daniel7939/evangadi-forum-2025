const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
  // 1️⃣ Get token from Authorization header
  const authHeader = req.header('Authorization');

  // 2️⃣ Check if token exists
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: '❌ No token provided, authorization denied.' });
  }

  // 3️⃣ Remove "Bearer " prefix if included
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');

    // 5️⃣ Attach decoded info to request
    req.user = decoded; // contains { id, email }
    next(); // continue to protected route
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: '❌ Invalid or expired token.' });
  }
}

module.exports = authMiddleware;
