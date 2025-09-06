const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sessionSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    default: () => uuidv4()
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true,
  expires: 3600 
});

module.exports = mongoose.model('Session', sessionSchema);