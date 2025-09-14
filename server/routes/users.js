// backend/routes/users.js
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

const router = express.Router();

// Get user profile and review history
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    const reviews = await Review.find({ userId: req.params.id })
      .populate('movieId', 'title posterURL')
      .populate('userId', 'username profilePicture')
      .sort({ timestamp: -1 });
    
    res.json({ user, reviews });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Update user profile
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get user's watchlist
router.get('/:id/watchlist', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const watchlist = await Watchlist.find({ userId: req.params.id })
      .populate('movieId')
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Watchlist.countDocuments({ userId: req.params.id });
    
    res.json({
      watchlist: watchlist.map(item => item.movieId),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Add movie to watchlist
router.post('/:id/watchlist', protect, async (req, res) => {
  try {
    // Check if user is updating their own watchlist
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }
    
    const { movieId } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ status: 'error', message: 'Movie not found' });
    }
    
    // Check if movie is already in watchlist
    const existingItem = await Watchlist.findOne({
      userId: req.params.id,
      movieId
    });
    
    if (existingItem) {
      return res.status(400).json({ status: 'error', message: 'Movie already in watchlist' });
    }
    
    const watchlistItem = await Watchlist.create({
      userId: req.params.id,
      movieId
    });
    
    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Remove movie from watchlist
router.delete('/:id/watchlist/:movieId', protect, async (req, res) => {
  try {
    // Check if user is updating their own watchlist
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'error', message: 'Not authorized' });
    }
    
    const watchlistItem = await Watchlist.findOneAndDelete({
      userId: req.params.id,
      movieId: req.params.movieId
    });
    
    if (!watchlistItem) {
      return res.status(404).json({ error: 'error', message: 'Movie not found in watchlist' });
    }
    
    res.json({ error: 'Success', message: 'Movie removed from watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'error', message: error.message });
  }
});

module.exports = router;