const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllCategories,
  createCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validation');

router.get('/', auth, getAllCategories);
router.post('/', auth, validateCategory, createCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;