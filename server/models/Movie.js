// backend/models/Movie.js
const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true
  },
  genre: {
    type: [String],
    required: [true, 'Please provide at least one genre']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Please provide a release year']
  },
  director: {
    type: String,
    required: [true, 'Please provide a director']
  },
  cast: [String],
  synopsis: {
    type: String,
    required: [true, 'Please provide a synopsis']
  },
  posterURL: {
    type: String,
    required: [true, 'Please provide a poster URL']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  trailerURL: String,
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', MovieSchema);