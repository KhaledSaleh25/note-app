const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  changePassword,
  changeName,
  enableOTP
} = require('../controllers/profileController');

router.get('/', auth, getProfile);
router.post('/change-password', auth, changePassword);
router.post('/change-first-last-name', auth, changeName);
router.post('/enable-otp', auth, enableOTP);

module.exports = router;