import User from '../models/user.model.js';
import Post from '../models/post.model.js';


export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Find all posts by this user
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, user, posts });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { userId } = req.params; // The ID of the user to follow/unfollow
    const currentUser = await User.findById(req.user._id); // The logged-in user
    const userToModify = await User.findById(userId);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { followers: req.user._id } });
      res.status(200).json({ success: true, message: 'User unfollowed.' });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { following: userId } });
      await User.findByIdAndUpdate(userId, { $push: { followers: req.user._id } });
      res.status(200).json({ success: true, message: 'User followed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};