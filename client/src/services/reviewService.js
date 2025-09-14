// frontend/src/services/reviewService.js
import api from './api';

export const reviewService = {
  // Get reviews for a movie
  getMovieReviews: async (movieId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/movies/${movieId}/reviews?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // Add a review
  addReview: async (movieId, reviewData) => {
    try {
      const response = await api.post(`/movies/${movieId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add review');
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  },

  // Get user reviews
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.reviews;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
};

export default reviewService;