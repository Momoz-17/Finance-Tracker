const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // FIX: Fetch the actual user object from DB and attach it to req.user
      // We exclude the password for security
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; 
      return next(); 
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };