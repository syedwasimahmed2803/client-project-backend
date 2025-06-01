const jwt = require('jsonwebtoken');
const logIssue = require('../utils/Logger');
const UserStorage = require('../storage/UserStorage');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await UserStorage.findById(decoded.id);
    if (!req.user) throw new Error('User not found');
    const currentIP = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    if (decoded.loginIP !== currentIP) {
      await logIssue('Token used from unauthorized IP', req.ip, {
        currentIP
      });
      return res.status(403).json({ message: 'Unauthorized IP' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;