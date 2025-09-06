const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    
    if (!user) {
      return res.status(200).json({ message: "Not authenticated" });
    }
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(200).json({ message: "Missing required fields" });
    }
    
   
    const user = await User.findOne({ username: req.user.username });
    
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    
    const isOldPasswordCorrect = await user.correctPassword(oldPassword, user.password);
    
    if (!isOldPasswordCorrect) {
      return res.status(200).json({ message: "Old password is incorrect" });
    }
    
   
    if (newPassword !== confirmPassword) {
      return res.status(200).json({ message: "Passwords do not match" });
    }
    
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const changeName = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
   
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { firstName, lastName },
      { new: true }
    );
    
    if (!user) {
      return res.status(200).json({ message: "Not authenticated" });
    }
    
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const enableOTP = async (req, res) => {
  try {
    const { enableOtp } = req.body;
    
    if (typeof enableOtp !== 'boolean') {
      return res.status(200).json({ message: "Enable OTP is required" });
    }
    
    
    
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getProfile,
  changePassword,
  changeName,
  enableOTP
};