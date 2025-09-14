/* eslint-disable no-unused-vars */
// frontend/src/pages/Home.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import { motion } from "motion/react";

const Home = () => {
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies({ limit: 8 }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <section className="mb-12">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to MovieReview
        </motion.h1>
        <motion.p 
          className="text-xl text-center text-gray-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Discover, review, and track your favorite movies
        </motion.p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;