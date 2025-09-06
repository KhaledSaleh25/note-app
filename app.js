require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


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


connectDB();

const app = express();


app.use(express.json());


const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const noteRoutes = require('./routes/notes');
const profileRoutes = require('./routes/profile');
const indexRoutes = require('./routes/index');


app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/notes', noteRoutes);
app.use('/profile', profileRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;