// frontend/src/components/ReviewCard.jsx
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../redux/slices/userSlice';
import { UserPlus, UserMinus, Loader } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { following, isLoading } = useSelector((state) => state.user);

  const isCurrentUser = userInfo && userInfo._id === review.userId._id;
  const isFollowing = following.some(user => user._id === review.userId._id);

  const handleFollowToggle = () => {
    if (!userInfo) return;
    
    if (isFollowing) {
      dispatch(unfollowUser(review.userId._id));
    } else {
      dispatch(followUser(review.userId._id));
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Link to={`/profile/${review.userId._id}`}>
            <img
              src={review.userId.profilePicture || '/default-avatar.png'}
              alt={review.userId.username}
              className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <div>
            <Link 
              to={`/profile/${review.userId._id}`}
              className="font-semibold hover:text-blue-400 transition-colors"
            >
              {review.userId.username}
            </Link>
            <p className="text-sm text-gray-400">
              {new Date(review.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {userInfo && !isCurrentUser && (
          <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              isFollowing 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white disabled:opacity-50`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
              <UserMinus className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span className="ml-1 hidden sm:inline">
              {isFollowing ? 'Following' : 'Follow'}
            </span>
          </button>
        )}
      </div>
      
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < review.rating ? 'text-yellow-400' : 'text-gray-400'
            }`}
          >
            ★
          </span>
        ))}
      </div>
      
      <p className="text-gray-300">{review.reviewText}</p>
    </div>
  );
};

export default ReviewCard;