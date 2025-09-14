/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unfollowUser } from '../redux/slices/userSlice';
import { UserPlus, UserMinus, Loader, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card className="cinema-card p-6 mb-4 bg-zinc-700">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${review.userId._id}`}>
                <motion.img
                  src={review.userId.profilePicture || '/default-avatar.png'}
                  alt={review.userId.username}
                  className="w-12 h-12 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Link>
              
              <div>
                <Link 
                  to={`/profile/${review.userId._id}`}
                  className="font-semibold hover:text-primary transition-colors text-foreground"
                >
                  {review.userId.username}
                </Link>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(review.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {userInfo && !isCurrentUser && (
              <Button
                onClick={handleFollowToggle}
                disabled={isLoading}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className={`${
                  isFollowing 
                    ? 'border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground' 
                    : 'bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary glow-primary'
                }`}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : isFollowing ? (
                  <UserMinus className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">
                  {isFollowing ? 'Following' : 'Follow'}
                </span>
              </Button>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className={`text-xl ${
                  i < review.rating ? 'text-accent' : 'text-muted-foreground/50'
                }`}
              >
                ★
              </motion.span>
            ))}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {review.rating}/5
            </span>
          </div>
          
          {/* Review Text */}
          <div className="relative">
            <p className="text-foreground/90 leading-relaxed">
              {review.reviewText}
            </p>
            
            {/* Decorative Quote */}
            <div className="absolute -top-2 -left-2 text-primary/20 text-4xl font-serif">
              "
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;