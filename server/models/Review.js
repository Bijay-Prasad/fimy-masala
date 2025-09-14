// backend/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Review must belong to a movie']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: [true, 'Please provide a review text'],
    maxlength: [1000, 'Review cannot be longer than 1000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews from the same user for the same movie
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);