require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/note-taking-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const noteRoutes = require('./routes/notes');
const profileRoutes = require('./routes/profile');
const indexRoutes = require('./routes/index');

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/notes', noteRoutes);
app.use('/profile', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler - Use this alternative syntax to avoid path-to-regexp issues
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;