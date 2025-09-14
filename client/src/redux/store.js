// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import reviewReducer from './slices/reviewSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    reviews: reviewReducer,
    user: userReducer,
  },
});