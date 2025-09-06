const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ownerUsername: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

categorySchema.index({ name: 1, ownerUsername: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);