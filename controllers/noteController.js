const Note = require('../models/Note');
const Category = require('../models/Category');

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ ownerUsername: req.user.username });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOne({
      _id: id,
      ownerUsername: req.user.username
    });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, categoryName } = req.body;
    
    // If category is provided, validate it belongs to the user
    if (categoryName) {
      const category = await Category.findOne({
        name: categoryName,
        ownerUsername: req.user.username
      });
      
      if (!category) {
        return res.status(400).json({ message: "Unknown category for this user" });
      }
    }
    
    // Create new note
    const note = new Note({
      title,
      content,
      ownerUsername: req.user.username,
      categoryName: categoryName || "Uncategorized"
    });
    
    await note.save();
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryName } = req.body;
    
    // If category is provided, validate it belongs to the user
    if (categoryName) {
      const category = await Category.findOne({
        name: categoryName,
        ownerUsername: req.user.username
      });
      
      if (!category) {
        return res.status(400).json({ message: "Unknown category for this user" });
      }
    }
    
    // Find and update note
    const note = await Note.findOneAndUpdate(
      { _id: id, ownerUsername: req.user.username },
      { title, content, categoryName: categoryName || "Uncategorized" },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const partialUpdateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryName } = req.body;
    
    // Build update object with only provided fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    
    // If category is provided, validate it belongs to the user
    if (categoryName) {
      const category = await Category.findOne({
        name: categoryName,
        ownerUsername: req.user.username
      });
      
      if (!category) {
        return res.status(400).json({ message: "Unknown category for this user" });
      }
      
      updateFields.categoryName = categoryName;
    }
    
    // Find and update note
    const note = await Note.findOneAndUpdate(
      { _id: id, ownerUsername: req.user.username },
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findOneAndDelete({
      _id: id,
      ownerUsername: req.user.username
    });
    
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  partialUpdateNote,
  deleteNote
};