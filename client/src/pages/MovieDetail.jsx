// frontend/src/pages/MovieDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, addReview } from '../redux/slices/movieSlice';
import { addToWatchlist, removeFromWatchlist, fetchUserWatchlist } from '../redux/slices/userSlice';
import ReviewCard from '../components/ReviewCard';
import { Star, Plus, Minus, Play, Loader } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, isLoading, error } = useSelector((state) => state.movies);
  const { userInfo } = useSelector((state) => state.auth);
  const { watchlist, isLoading: watchlistLoading } = useSelector((state) => state.user);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [trailerPlaying, setTrailerPlaying] = useState(false);

  // Check if current movie is in watchlist
  const isInWatchlist = watchlist.some(movie => movie._id === id);

  useEffect(() => {
    dispatch(fetchMovie(id));
    
    // Fetch user's watchlist if user is logged in
    if (userInfo) {
      dispatch(fetchUserWatchlist(userInfo._id));
    }
  }, [dispatch, id, userInfo]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(addReview({ movieId: id, reviewData: reviewForm }))
      .unwrap()
      .then(() => {
        setReviewForm({ rating: 5, reviewText: '' });
        setShowReviewForm(false);
      })
      .catch((error) => {
        console.error('Failed to submit review:', error);
      });
  };

  const handleWatchlistToggle = () => {
    if (!userInfo) return;
    
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ userId: userInfo._id, movieId: id }))
        .unwrap()
        .then(() => {
          // Successfully removed from watchlist
          console.log('Removed from watchlist');
        })
        .catch((error) => {
          console.error('Failed to remove from watchlist:', error);
        });
    } else {
      dispatch(addToWatchlist({ userId: userInfo._id, movieId: id }))
        .unwrap()
        .then(() => {
          // Successfully added to watchlist
          console.log('Added to watchlist');
          // Refresh watchlist to get updated data
          dispatch(fetchUserWatchlist(userInfo._id));
        })
        .catch((error) => {
          console.error('Failed to add to watchlist:', error);
        });
    }
  };

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

  if (!currentMovie) {
    return <div>Movie not found</div>;
  }

  return (
    <div>
      {/* Movie Header */}
      <div className="relative mb-8">
        <div className="h-96 w-full overflow-hidden rounded-lg">
          <img
            src={currentMovie.movie.posterURL}
            alt={currentMovie.movie.title}
            className="w-full h-full object-cover"
          />
          {currentMovie.movie.trailerURL && (
            <button
              onClick={() => setTrailerPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-all"
            >
              <Play className="w-16 h-16 text-white" />
            </button>
          )}
        </div>

        {trailerPlaying && currentMovie.movie.trailerURL && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setTrailerPlaying(false)}
                className="absolute -top-12 right-0 text-white text-lg"
              >
                Close
              </button>
              <iframe
                src={currentMovie.movie.trailerURL}
                className="w-full h-96"
                frameBorder="0"
                allowFullScreen
                title="Movie Trailer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{currentMovie.movie.title}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-6">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg">
                {currentMovie.movie.averageRating
                  ? currentMovie.movie.averageRating.toFixed(1)
                  : 'No ratings yet'}
              </span>
            </div>
            <span className="text-gray-400">{currentMovie.movie.releaseYear}</span>
            {currentMovie.movie.duration && (
              <span className="ml-6 text-gray-400">
                {Math.floor(currentMovie.movie.duration / 60)}h {currentMovie.movie.duration % 60}m
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed">{currentMovie.movie.synopsis}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Director</h3>
              <p>{currentMovie.movie.director}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Cast</h3>
              <p>{currentMovie.movie.cast?.join(', ') || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Genre</h3>
              <p>{currentMovie.movie.genre.join(', ')}</p>
            </div>
          </div>

          {userInfo && (
            <button 
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {watchlistLoading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : isInWatchlist ? (
                <Minus className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {userInfo && (
          <div>
            {showReviewForm ? (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-2xl focus:outline-none"
                        >
                          {star <= reviewForm.rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Review</label>
                    <textarea
                      value={reviewForm.reviewText}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, reviewText: e.target.value })
                      }
                      rows="4"
                      className="w-full p-2 bg-gray-700 rounded text-white"
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Write a Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Reviews ({currentMovie.reviews?.length || 0})
        </h2>

        {currentMovie.reviews && currentMovie.reviews.length > 0 ? (
          <div>
            {currentMovie.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;