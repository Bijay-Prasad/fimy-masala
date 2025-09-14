// frontend/src/pages/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUserProfile, 
  fetchUserWatchlist, 
  fetchUserFollowers,
  fetchUserFollowing,
  followUser,
  unfollowUser
} from '../redux/slices/userSlice';
import { fetchUserReviews } from '../redux/slices/reviewSlice';
import ReviewCard from '../components/ReviewCard';
import MovieCard from '../components/MovieCard';
import { UserPlus, UserMinus, Loader, Users, Film } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { 
    userProfile, 
    watchlist, 
    followers, 
    following, 
    isLoading, 
    error
  } = useSelector((state) => state.user);
  const { userReviews } = useSelector((state) => state.reviews);

  const [activeTab, setActiveTab] = useState('reviews');

  const isCurrentUser = userInfo && userInfo._id === userId;
  const isFollowing = following.some(user => user._id === userId);
  console.log("following:", following);
  console.log("isFollowing:", isFollowing);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserWatchlist(userId));
      dispatch(fetchUserReviews(userId));
      dispatch(fetchUserFollowers(userId));
      dispatch(fetchUserFollowing(userId));
    }
  }, [dispatch, userId]);

  const handleFollowToggle = () => {
    if (!userInfo) return;
    
    if (isFollowing) {
      dispatch(unfollowUser(userId))
        .unwrap()
        .then(() => {
          // Refresh data
          dispatch(fetchUserProfile(userId));
          dispatch(fetchUserFollowers(userId));
          dispatch(fetchUserFollowing(userInfo._id));
        });
    } else {
      dispatch(followUser(userId))
        .unwrap()
        .then(() => {
          // Refresh data
          dispatch(fetchUserProfile(userId));
          dispatch(fetchUserFollowers(userId));
          dispatch(fetchUserFollowing(userInfo._id));
        });
    }
  };

  if (isLoading && !userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-300">User not found</h1>
        <p className="text-gray-400 mt-2">The user you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="flex items-center">
          <img
            src={userProfile.user.profilePicture || '/default-avatar.png'}
            alt={userProfile.user.username}
            className="w-20 h-20 rounded-full mr-6 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{userProfile.user.username}</h1>
            <p className="text-gray-400">{userProfile.user.email}</p>
            <p className="text-gray-400 text-sm">
              Member since {new Date(userProfile.user.joinDate).toLocaleDateString()}
            </p>
            <div className="flex space-x-6 mt-3">
              <span className="text-gray-300 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {userProfile.user.followersCount} followers
              </span>
              <span className="text-gray-300 flex items-center">
                <UserPlus className="w-4 h-4 mr-1" />
                {userProfile.user.followingCount} following
              </span>
              <span className="text-gray-300 flex items-center">
                <Film className="w-4 h-4 mr-1" />
                {userReviews.length} reviews
              </span>
            </div>
          </div>
          
          {userInfo && !isCurrentUser && (
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`px-4 py-2 rounded flex items-center ${
                isFollowing 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : isFollowing ? (
                <UserMinus className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Reviews ({userReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'watchlist'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </nav>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'reviews' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {isCurrentUser ? 'You haven' : 'This user hasn'}t written any reviews yet.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {watchlist.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {isCurrentUser ? 'Your watchlist is empty.' : 'This user\'s watchlist is empty.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;