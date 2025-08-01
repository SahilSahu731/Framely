import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


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
      imageUrl: image.secure_url,
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
    };

    // Find the post and push the new comment object into the comments array
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment },
      },
      { new: true }
    ).populate('comments.author', 'username profilePicture'); 

    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }
    
    // Return just the last added comment to the client for an optimistic update
    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: 'Comment added.',
      comment: addedComment,
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