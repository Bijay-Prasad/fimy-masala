// backend/models/Watchlist.js
const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Watchlist must belong to a user']
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Watchlist must have a movie']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate entries
WatchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);