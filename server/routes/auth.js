// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ status: 'Error', message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        status: 'Success',
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        profilePicture: user.profilePicture,
        joinDate: user.joinDate,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(400).json({ status: 'Error', message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.correctPassword(password, user.password))) {
      res.json({
        status: 'Success',
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        profilePicture: user.profilePicture,
        joinDate: user.joinDate,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'Success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

module.exports = router;