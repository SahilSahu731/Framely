import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    const image = await uploadOnCloudinary(imageLocalPath);

    if (!image?.secure_url) {
      return res.status(500).json({ success: false, message: 'Failed to upload image.' });
    }

    const newPost = await Post.create({
      author: req.user._id, // From  middleware
      caption,
       image: {
        url: image.secure_url,
        public_id: image.public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      post: newPost,
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const authorId = req.user._id;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const newComment = {
      text,
      author: authorId,
      createdAt: new Date(),
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Create a notification for the post's author, but not for their own comment
    if (updatedPost.author.toString() !== authorId.toString()) {
        const notification = await Notification.create({
            sender: authorId,
            receiver: updatedPost.author,
            type: 'comment',
            contentId: postId,
        });
        req.io.to(updatedPost.author.toString()).emit('newNotification', notification);
    }
    
    // Populate the author details for the newly added comment to send to the client
    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];
    const populatedComment = await Post.populate(addedComment, { path: 'author', select: 'username profilePicture' });

    return res.status(201).json({
      success: true,
      message: 'Comment added.',
      comment: populatedComment,
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Show newest posts first
      .populate('author', 'username profilePicture') // Populate the post author's details
      .populate('comments.author', 'username profilePicture'); // Populate the author for each comment

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const toggleLikeOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // If already liked, unlike it
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      res.status(200).json({ success: true, message: 'Post unliked.' });
    } else {
      // If not liked, like it
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });

      // Create a notification for the post's author, but not if they like their own post
      if (post.author.toString() !== userId.toString()) {
        const notification = await Notification.create({
          sender: userId,
          receiver: post.author,
          type: 'like',
          contentId: post._id,
        });
        
        // Emit a real-time event to the specific receiver's "room"
        req.io.to(post.author.toString()).emit('newNotification', notification);
      }
      
      res.status(200).json({ success: true, message: 'Post liked.' });
    }
  } catch (error) {
    console.error('Error toggling like on post:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Security Check: Only the author can delete their post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(post.image.public_id);

    // Delete post from the database
    await post.deleteOne();

    return res.status(200).json({ success: true, message: 'Post deleted successfully.' });

  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate('author', 'username profilePicture')
      .populate('comments.author', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error fetching single post:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};