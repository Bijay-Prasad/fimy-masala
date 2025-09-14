// frontend/src/services/userService.js
import api from './api';

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user profile');
    }
  },

  // Get user watchlist
  getWatchlist: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/users/${userId}/watchlist?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch watchlist');
    }
  },

  // Add to watchlist
  addToWatchlist: async (userId, movieId) => {
    try {
      const response = await api.post(`/users/${userId}/watchlist`, { movieId });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add to watchlist');
    }
  },

  // Remove from watchlist
  removeFromWatchlist: async (userId, movieId) => {
    try {
      await api.delete(`/users/${userId}/watchlist/${movieId}`);
      return movieId;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to remove from watchlist');
    }
  },

  // Follow user
  followUser: async (userId) => {
    try {
      const response = await api.post(`/social/follow/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to follow user');
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/social/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unfollow user');
    }
  },

  // Get user followers
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/social/followers/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch followers');
    }
  },

  // Get user following
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/social/following/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch following');
    }
  }
};

export default userService;