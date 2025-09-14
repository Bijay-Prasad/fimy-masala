/* eslint-disable no-unused-vars */
// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchUserProfile,
  fetchUserWatchlist,
  updateUserProfile,
  addToWatchlist,
  removeFromWatchlist,
  fetchUserFollowers,
  fetchUserFollowing,
  followUser,
  unfollowUser
} from '../redux/slices/userSlice';
import { fetchUserReviews } from '../redux/slices/reviewSlice';
import ReviewCard from '../components/ReviewCard';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    userProfile,
    watchlist,
    followers,
    following,
    isLoading,
    error,
    watchlistPagination
  } = useSelector((state) => state.user);
  const { userReviews } = useSelector((state) => state.reviews);

  const [activeTab, setActiveTab] = useState('reviews');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    profilePicture: ''
  });

  // useEffect(() => {
  //   if (userInfo) {
  //     // Redirect to the user's profile page
  //     navigate(`/profile/${userInfo._id}`, { replace: true });
  //   }
  // }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserProfile(userInfo._id));
      dispatch(fetchUserWatchlist(userInfo._id));
      dispatch(fetchUserReviews(userInfo._id));
      dispatch(fetchUserFollowers(userInfo._id));
      dispatch(fetchUserFollowing(userInfo._id));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        username: userProfile.user.username,
        email: userProfile.user.email,
        profilePicture: userProfile.user.profilePicture || ''
      });
    }
  }, [userProfile]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({
      userId: userInfo._id,
      userData: editForm
    }))
      .unwrap()
      .then(() => {
        setEditMode(false);
      })
      .catch((error) => {
        console.error('Failed to update profile:', error);
      });
  };

  const handleAddToWatchlist = (movieId) => {
    dispatch(addToWatchlist({ userId: userInfo._id, movieId }))
      .unwrap()
      .then(() => {
        // Refetch watchlist to get updated data
        dispatch(fetchUserWatchlist(userInfo._id));
      });
  };

  const handleRemoveFromWatchlist = (movieId) => {
    dispatch(removeFromWatchlist({ userId: userInfo._id, movieId }));
  };

  const handleFollowUser = (userId) => {
    dispatch(followUser(userId))
      .unwrap()
      .then(() => {
        // Refetch followers count
        dispatch(fetchUserProfile(userInfo._id));
      });
  };

  const handleUnfollowUser = (userId) => {
    dispatch(unfollowUser(userId))
      .unwrap()
      .then(() => {
        // Refetch followers count
        dispatch(fetchUserProfile(userInfo._id));
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center text-xl">User not found</div>;
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <div className="flex items-center">
          <img
            src={userProfile.user.profilePicture || '/default-avatar.png'}
            alt={userProfile.user.username}
            className="w-20 h-20 rounded-full mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold">{userProfile.user.username}</h1>
            <p className="text-gray-400">{userProfile.user.email}</p>
            <p className="text-gray-400 text-sm">
              Member since {new Date(userProfile.user.joinDate).toLocaleDateString()}
            </p>
            <div className="flex space-x-4 mt-2">
              <span className="text-gray-300">
                {userProfile.user.followersCount} followers
              </span>
              <span className="text-gray-300">
                {userProfile.user.followingCount} following
              </span>
              <span className="text-gray-300">
                {userReviews.length} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'watchlist'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            Watchlist
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'followers'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'following'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
              ? 'border-blue-500 text-blue-500'
              : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
          >
            Settings
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
          <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
          {userReviews.length > 0 ? (
            userReviews.map((review) => <ReviewCard key={review._id} review={review} />)
          ) : (
            <p className="text-gray-400">You haven't written any reviews yet.</p>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">My Watchlist</h2>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {watchlist.map((movie) => (
                <div key={movie._id} className="relative">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => handleRemoveFromWatchlist(movie._id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Your watchlist is empty.</p>
          )}
        </div>
      )}

      {activeTab === 'followers' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Followers</h2>
          {followers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followers.map((follower) => (
                <div key={follower._id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={follower.profilePicture || '/default-avatar.png'}
                      alt={follower.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span>{follower.username}</span>
                  </div>
                  <button
                    onClick={() => handleUnfollowUser(follower._id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You don't have any followers yet.</p>
          )}
        </div>
      )}

      {activeTab === 'following' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Following</h2>
          {following.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {following.map((user) => (
                <div key={user._id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <Link to={`/profile/${user._id}`}>
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture || '/default-avatar.png'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span>{user.username}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleUnfollowUser(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You're not following anyone yet.</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            {editMode ? (
              <form onSubmit={handleEditSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
                    <input
                      type="url"
                      value={editForm.profilePicture}
                      onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded text-white"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Username</label>
                    <p className="text-white">{userProfile.user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                    <p className="text-white">{userProfile.user.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Profile Picture</label>
                    <img
                      src={userProfile.user.profilePicture || '/default-avatar.png'}
                      alt={userProfile.user.username}
                      className="w-20 h-20 rounded-full"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;