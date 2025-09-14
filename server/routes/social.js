// backend/routes/social.js
const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Follow a user
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    if (req.user.following.includes(userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    // Add to following list
    req.user.following.push(userId);
    req.user.followingCount += 1;
    await req.user.save();
    
    // Add to follower list of the other user
    userToFollow.followers.push(req.user._id);
    userToFollow.followersCount += 1;
    await userToFollow.save();
    
    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if following
    if (!req.user.following.includes(userId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }
    
    // Remove from following list
    req.user.following = req.user.following.filter(
      id => id.toString() !== userId
    );
    req.user.followingCount -= 1;
    await req.user.save();
    
    // Remove from follower list of the other user
    const userToUnfollow = await User.findById(userId);
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    userToUnfollow.followersCount -= 1;
    await userToUnfollow.save();
    
    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('followers', 'username profilePicture')
      .select('followers');
    
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users followed by a user
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('following', 'username profilePicture')
      .select('following');
    
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews from followed users
router.get('/feed', protect, async (req, res) => {
  try {
    const Review = require('../models/Review');
    
    const reviews = await Review.find({
      userId: { $in: req.user.following }
    })
    .populate('userId', 'username profilePicture')
    .populate('movieId', 'title posterURL')
    .sort({ timestamp: -1 })
    .limit(20);
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;