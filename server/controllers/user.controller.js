import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
import Conversation from '../models/conversation.model.js';


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
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    const currentUser = await User.findById(currentUserId);
    const userToModify = await User.findById(userId);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow logic
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } });
      res.status(200).json({ success: true, message: 'User unfollowed.' });
    } else {
      // Follow logic
      await User.findByIdAndUpdate(currentUserId, { $push: { following: userId } });
      await User.findByIdAndUpdate(userId, { $push: { followers: currentUserId } });
      
      // Create a notification for the user who was just followed
      const notification = await Notification.create({
          sender: currentUserId,
          receiver: userId,
          type: 'follow',
      });
      req.io.to(userId).emit('newNotification', notification);

      res.status(200).json({ success: true, message: 'User followed.' });
    }
  } catch (error) {
    console.error('Error in followUnfollowUser:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // Get the search query from the query parameters

    if (!q) {
      return res.status(200).json({ success: true, users: [] }); // Return empty if no query
    }

    // Use a case-insensitive regular expression to find matching users
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
      ],
    }).select('username fullName profilePicture'); // Select only the fields you need

    return res.status(200).json({ success: true, users });

  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all conversations the user is a part of
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        }).populate({
            path: 'participants',
            select: 'username profilePicture', // Select fields for the other user
        });

        // Filter out the current user from participants list to get the other user's info
        const users = conversations.map(conv => {
            return conv.participants.find(p => p._id.toString() !== loggedInUserId.toString());
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all users except the current one
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error in getAllUsers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserById: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};