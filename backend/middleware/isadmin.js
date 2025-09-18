const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User/GeneralUser');
const TagRole = require('../models/Tag/TagRole');
const JWT_SECRET = process.env.JWT_SECRET;

const adminMiddleware = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token)
    return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user.id;

    // Fetch user
    const user = await User.findById(userId).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if role name is 'admin'
    if (user.role.name.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = user; // Attach user to request
    next(); // Allow to proceed

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = adminMiddleware;
