const User = require('../models/User');
const Session = require('../models/Session');
const { generateOTP, generateResetToken } = require('../utils/helpers');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/emailService');

const register = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    
    
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    
    const newUser = new User({
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(),
      firstName,
      lastName
    });
    
    await newUser.save();
    
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginStart = async (req, res) => {
  try {
    const { username, password } = req.body;
    
   
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    }
    
   
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }
    
    
    const existingSession = await Session.findOne({ username: user.username });
    
    if (existingSession) {
      return res.status(400).json({ message: "User already logged in" });
    }
    
   
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    
    const emailSent = await sendOTPEmail(user.email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }
    
    res.status(200).json({
      message: "OTP sent successfully",
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginVerify = async (req, res) => {
  try {
    const { username, otpCode } = req.body;
    
   
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    if (!user.otp || !user.otpExpiry) {
      return res.status(401).json({ message: "No active OTP" });
    }
    
    if (user.otpExpiry < new Date()) {
    
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    
    if (user.otp !== otpCode) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }
    
  
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    
   
    const session = new Session({
      username: user.username,
      role: user.role
    });
    
    await session.save();
    
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      },
      session: {
        username: session.username,
        token: session.token,
        role: session.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    

    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();
    
    
    const emailSent = await sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send reset email" });
    }
    
    res.status(200).json({
      message: "Password reset token sent successfully",
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { passwordResetToken } = req.query;
    const { newPassword, confirmPassword } = req.body;
    
    if (!passwordResetToken) {
      return res.status(400).json({ message: "Password reset token required" });
    }
    

    const user = await User.findOne({ passwordResetToken });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
   
    if (user.passwordResetTokenExpiry < new Date()) {
      
      user.passwordResetToken = null;
      user.passwordResetTokenExpiry = null;
      await user.save();
      
      return res.status(400).json({ message: "Password reset token expired" });
    }
    

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    
    
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    await user.save();
    
    res.status(200).json({
      ok: true,
      updatedUser: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.header('token');
    
    if (!token) {
      return res.status(200).json({ message: "Not authenticated" });
    }
    
    
    const result = await Session.deleteOne({ token });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Can't logout" });
    }
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  loginStart,
  loginVerify,
  forgotPassword,
  resetPassword,
  logout
};