// frontend/src/redux/slices/movieSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        genre = '',
        year = '',
        minRating = '',
      } = filters;
      
      const params = new URLSearchParams();
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);
      if (minRating) params.append('minRating', minRating);
      
      const response = await axios.get(`${API_URL}/movies?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch movies'
      );
    }
  }
);

export const fetchMovie = createAsyncThunk(
  'movies/fetchMovie',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/movies/${movieId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch movie'
      );
    }
  }
);

export const addReview = createAsyncThunk(
  'movies/addReview',
  async ({ movieId, reviewData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };
      
      const response = await axios.post(
        `${API_URL}/movies/${movieId}/reviews`,
        reviewData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

const initialState = {
  movies: [],
  currentMovie: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalMovies: 0,
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.movies;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalMovies = action.payload.totalMovies;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single movie
      .addCase(fetchMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add review
      .addCase(addReview.fulfilled, (state, action) => {
        if (state.currentMovie) {
          state.currentMovie.reviews.unshift(action.payload);
        }
      });
  },
});

export const { clearError, clearCurrentMovie } = movieSlice.actions;
export default movieSlice.reducer;