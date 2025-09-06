const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Note = require('../models/Note');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ ownerUsername: req.user.username });
    const notes = await Note.find({ ownerUsername: req.user.username });
    
    res.status(200).json({
      currentUser: {
        username: req.user.username,
        role: req.user.role
      },
      categories,
      notes
    });
  } catch (error) {
    res.status(200).json({ message: "Not authenticated" });
  }
});

module.exports = router;