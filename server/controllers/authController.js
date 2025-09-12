const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const sendEmail = require("../utils/sendEmail"); // if you have a utility for sending mail

const ADMIN_CREDENTIALS = {
  email: 'admin@shoestore.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin'
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

const fetchuser = async (req, res) => {
  try {
    const data = req.user;
    console.log("Fetched user data:", data);
    res.status(200).json({ message: "User data fetched", data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    //   const token = jwt.sign(
    //     {
    //       userId: 'admin-001',
    //       email: ADMIN_CREDENTIALS.email,
    //       role: ADMIN_CREDENTIALS.role,
    //     },
    //     process.env.JWT_SECRET,
    //     { expiresIn: '1d' }
    //   );

    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     maxAge: 24 * 60 * 60 * 1000,
    //   });

    //   return res.json({
    //     message: 'Admin login successful',
    //     data: {
    //       email: ADMIN_CREDENTIALS.email,
    //       role: ADMIN_CREDENTIALS.role,
    //       name: ADMIN_CREDENTIALS.name,
    //     },
    //   });
    // }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      data: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getDashboardStats = (req, res) => {
  res.json({
    totalProducts: 100,
    totalUsers: 200,
    totalOrders: 80,
    totalRevenue: 15000,
  });
};

const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 15 * 60 * 1000;
    user.isOTPVerified = false;
    await user.save();

    const html = `<h2>Your OTP Code</h2><p>OTP: <strong>${otp}</strong></p><p>Valid for 15 minutes.</p>`;
    await sendEmail(email, "Password Reset OTP", html);

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isOTPVerified = true;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ success: true, message: "OTP verified." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ message: "Email and new password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isOTPVerified) {
      return res.status(400).json({ message: "OTP not verified." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOTPVerified = false;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("name email profile role");
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};  


module.exports = {
  registerUser,
  login,
  fetchuser,
  getDashboardStats,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
  fetchAllUsers,  
};
