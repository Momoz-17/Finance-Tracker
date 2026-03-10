const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- FIX 1: Enhanced sendOTP for Profile Security ---
exports.sendOTP = async (req, res) => {
  try {
    // Ensure the authMiddleware has populated req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized, no user ID found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Security: Password Change OTP',
      message: `Your OTP for changing your password is:`,
      otp: otp
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Failed to send email. Check SMTP settings." });
  }
};

// --- UPDATED: Unified Change Password with OTP ---
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, otp } = req.body;
    
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Check if OTP is valid
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    // 3. Update password and clear OTP fields
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- AUTH LOGIC: SIGNUP/SIGNIN/FORGET ---

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    user = new User({ username, email, password, otp, otpExpires });
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Verification Code',
        message: `Your OTP for Finance Tracker is:`,
        otp: otp
      });
      return res.status(201).json({ message: "OTP sent to email. Please verify." });
    } catch (err) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message: `Your reset OTP is:`,
      otp: otp
    });

    return res.status(200).json({ message: "Reset OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- FIX 2: Resolved 'res' linter warning by using the response message ---
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Directly returning the response instead of assigning to unused variable
    return res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};