// frontend/src/pages/Movies.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../redux/slices/movieSlice';
import MovieCard from '../components/MovieCard';

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, isLoading, error, currentPage, totalPages } = useSelector(
    (state) => state.movies
  );

  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    year: '',
    minRating: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchMovies(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
  };

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Sample genres (you could fetch these from your API)
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
  ];

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Browse Movies</h1>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search movies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Min Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {/* No results message */}
      {movies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-300">No movies found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;