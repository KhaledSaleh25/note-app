const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  partialUpdateNote,
  deleteNote
} = require('../controllers/noteController');
const { validateNote } = require('../middleware/validation');

router.get('/', auth, getAllNotes);
router.get('/:id', auth, getNote);
router.post('/', auth, validateNote, createNote);
router.put('/:id', auth, validateNote, updateNote);
router.patch('/:id', auth, partialUpdateNote);
router.delete('/:id', auth, deleteNote);

module.exports = router;