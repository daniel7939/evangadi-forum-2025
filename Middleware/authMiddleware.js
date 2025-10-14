const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
