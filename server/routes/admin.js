// backend/routes/admin.js
const express = require('express');
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const router = express.Router();

// Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ joinDate: -1 })
      .limit(5)
      .select('username email joinDate');
    
    // Get recent movies
    const recentMovies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title releaseYear averageRating');
    
    // Get recent reviews
    const recentReviews = await Review.find()
      .populate('userId', 'username')
      .populate('movieId', 'title')
      .sort({ timestamp: -1 })
      .limit(5);
    
    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totals: {
        users: totalUsers,
        movies: totalMovies,
        reviews: totalReviews
      },
      recentUsers,
      recentMovies,
      recentReviews,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ joinDate: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (make admin, etc.)
router.put('/users/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Also delete user's reviews and watchlist items
    await Review.deleteMany({ userId });
    const Watchlist = require('../models/Watchlist');
    await Watchlist.deleteMany({ userId });
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete movie
router.delete('/movies/:movieId', protect, admin, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Also delete reviews for this movie
    await Review.deleteMany({ movieId });
    const Watchlist = require('../models/Watchlist');
    await Watchlist.deleteMany({ movieId });
    
    await Movie.findByIdAndDelete(movieId);
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;