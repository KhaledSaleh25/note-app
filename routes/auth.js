const express = require('express');
const router = express.Router();
const {
  register,
  loginStart,
  loginVerify,
  forgotPassword,
  resetPassword,
  logout
} = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  validateOTP
} = require('../middleware/validation');

router.post('/register', validateRegister, register);
router.post('/login/start', validateLogin, loginStart);
router.post('/login/verify', validateOTP, loginVerify);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/logout', logout);

module.exports = router;