// backend/routes/movies.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/auth');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    // if (req.query.genre) filter.genre = { $in: req.query.genre.split(',') };
    // Genre filter (multiple genres)
    if (req.query.genre) {
      const genres = Array.isArray(req.query.genre) 
        ? req.query.genre 
        : req.query.genre.split(',');
      filter.genre = { $in: genres };
    }
    if (req.query.year) filter.releaseYear = parseInt(req.query.year);
    if (req.query.yearFrom || req.query.yearTo) {
      filter.releaseYear = {};
      if (req.query.yearFrom) filter.releaseYear.$gte = parseInt(req.query.yearFrom);
      if (req.query.yearTo) filter.releaseYear.$lte = parseInt(req.query.yearTo);
    }
    if (req.query.minRating) filter.averageRating = { $gte: parseFloat(req.query.minRating) };
    if (req.query.maxRating) {
      filter.averageRating = filter.averageRating || {};
      filter.averageRating.$lte = parseFloat(req.query.maxRating);
    }

     // Duration filter
    if (req.query.minDuration) filter.duration = { $gte: parseInt(req.query.minDuration) };
    if (req.query.maxDuration) {
      filter.duration = filter.duration || {};
      filter.duration.$lte = parseInt(req.query.maxDuration);
    }

    // Cast filter
    if (req.query.cast) {
      const castMembers = Array.isArray(req.query.cast) 
        ? req.query.cast 
        : req.query.cast.split(',');
      filter.cast = { $in: castMembers.map(name => new RegExp(name, 'i')) };
    }

    // Director filter
    if (req.query.director) {
      filter.director = new RegExp(req.query.director, 'i');
    }
    
    // Search by title
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }
    
    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = sortOrder;
    } else {
      sort = { averageRating: -1, title: 1 };
    }

    const movies = await Movie.find(filter)
      .sort({ averageRating: -1, title: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Movie.countDocuments(filter);

    // // Get available filters for the current results
    // const availableFilters = await this.getAvailableFilters(filter);
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single movie with reviews
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Get reviews for this movie with user info
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'username profilePicture')
      .sort({ timestamp: -1 });
    
    res.json({ movie, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new movie (admin only - you can add admin check middleware later)
router.post('/', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a specific movie
router.get('/:id/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ movieId: req.params.id })
      .populate('userId', 'username profilePicture')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ movieId: req.params.id });
    
    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a review for a movie
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: req.user._id,
      movieId: req.params.id
    });
    
    if (existingReview) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this movie' });
    }
    
    const review = await Review.create({
      userId: req.user._id,
      movieId: req.params.id,
      rating,
      reviewText
    });
    
    // Update movie's average rating
    const reviews = await Review.find({ movieId: req.params.id });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    
    await Movie.findByIdAndUpdate(req.params.id, { averageRating: avgRating });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;