const Category = require('../models/Category');
const Note = require('../models/Note');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ ownerUsername: req.user.username });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    const existingCategory = await Category.findOne({
      name,
      ownerUsername: req.user.username
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    

    const category = new Category({
      name,
      ownerUsername: req.user.username
    });
    
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const category = await Category.findOne({
      _id: id,
      ownerUsername: req.user.username
    });
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
  
    const notesWithCategory = await Note.findOne({
      categoryName: category.name,
      ownerUsername: req.user.username
    });
    
    if (notesWithCategory) {
      return res.status(400).json({ message: "Category in use by notes" });
    }
    
    
    await Category.deleteOne({ _id: id });
    
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory
};