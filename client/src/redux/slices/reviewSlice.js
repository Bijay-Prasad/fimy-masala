/* eslint-disable no-unused-vars */
// frontend/src/redux/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchMovieReviews = createAsyncThunk(
  'reviews/fetchMovieReviews',
  async ({ movieId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/movies/${movieId}/reviews?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ movieId, reviewData }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(`/movies/${movieId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add review');
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const initialState = {
  movieReviews: {},
  userReviews: {},
  currentReview: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  }
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    setReviewPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch movie reviews
      .addCase(fetchMovieReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        const { movieId, reviews, currentPage, totalPages, totalReviews } = action.payload;
        
        if (!state.movieReviews[movieId]) {
          state.movieReviews[movieId] = [];
        }
        
        state.movieReviews[movieId] = reviews;
        state.pagination = {
          currentPage,
          totalPages,
          totalReviews
        };
      })
      .addCase(fetchMovieReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const { review, movieId } = action.payload;
        
        if (!state.movieReviews[movieId]) {
          state.movieReviews[movieId] = [];
        }
        
        // Add the new review to the beginning of the list
        state.movieReviews[movieId].unshift(review);
        
        // Update pagination
        state.pagination.totalReviews += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalReviews / 10);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReviews = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedReview = action.payload;
        
        // Update in movie reviews
        Object.keys(state.movieReviews).forEach(movieId => {
          const index = state.movieReviews[movieId].findIndex(
            review => review._id === updatedReview._id
          );
          if (index !== -1) {
            state.movieReviews[movieId][index] = updatedReview;
          }
        });
        
        // Update in user reviews
        Object.keys(state.userReviews).forEach(userId => {
          const index = state.userReviews[userId].findIndex(
            review => review._id === updatedReview._id
          );
          if (index !== -1) {
            state.userReviews[userId][index] = updatedReview;
          }
        });
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedReviewId = action.payload;
        
        // Remove from movie reviews
        Object.keys(state.movieReviews).forEach(movieId => {
          state.movieReviews[movieId] = state.movieReviews[movieId].filter(
            review => review._id !== deletedReviewId
          );
        });
        
        // Remove from user reviews
        Object.keys(state.userReviews).forEach(userId => {
          state.userReviews[userId] = state.userReviews[userId].filter(
            review => review._id !== deletedReviewId
          );
        });
        
        // Update pagination
        state.pagination.totalReviews -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalReviews / 10);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentReview, setReviewPage } = reviewSlice.actions;
export default reviewSlice.reducer;