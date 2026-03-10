const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  signup, 
  verifyOTP, 
  signin, 
  forgetPassword, 
  resetPassword, 
  changePassword,
  sendOTP // Import the new function
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/send-otp', protect, sendOTP); // Added this route
router.put('/change-password', protect, changePassword);

module.exports = router;