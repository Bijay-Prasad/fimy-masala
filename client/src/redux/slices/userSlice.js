/* eslint-disable no-unused-vars */
// frontend/src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

export const fetchUserWatchlist = createAsyncThunk(
  'user/fetchUserWatchlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/watchlist`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'user/addToWatchlist',
  async ({ userId, movieId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}/watchlist`, { movieId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'user/removeFromWatchlist',
  async ({ userId, movieId }, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}/watchlist/${movieId}`);
      return movieId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from watchlist');
    }
  }
);

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/follow/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/social/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  'user/fetchUserFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/followers/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const fetchUserFollowing = createAsyncThunk(
  'user/fetchUserFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/social/following/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

const initialState = {
  currentUser: null,
  userProfile: null,
  watchlist: [],
  followers: [],
  following: [],
  isLoading: false,
  error: null,
  watchlistPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },
    setWatchlistPage: (state, action) => {
      state.watchlistPagination.currentPage = action.payload;
    },
    resetUserState: (state) => {
      state.currentUser = null;
      state.userProfile = null;
      state.watchlist = [];
      state.followers = [];
      state.following = [];
      state.isLoading = false;
      state.error = null;
      state.watchlistPagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile.user = action.payload;
        
        // Also update current user if it's the same user
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user watchlist
      .addCase(fetchUserWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = action.payload.watchlist;
        state.watchlistPagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems
        };
      })
      .addCase(fetchUserWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to watchlist
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // The movie will be added to the watchlist when we refetch it
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from watchlist
      .addCase(removeFromWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = state.watchlist.filter(movie => movie._id !== action.payload);
        state.watchlistPagination.totalItems -= 1;
      })
      .addCase(removeFromWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.userProfile) {
          state.userProfile.user.followersCount += 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.userProfile) {
          state.userProfile.user.followersCount -= 1;
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user followers
      .addCase(fetchUserFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user following
      .addCase(fetchUserFollowing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.following = action.payload;
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearUserProfile, 
  setWatchlistPage, 
  resetUserState 
} = userSlice.actions;

export default userSlice.reducer;