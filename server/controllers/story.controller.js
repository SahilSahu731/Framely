import Story from '../models/story.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const addStory = async (req, res) => {
  try {
    const authorId = req.user._id;
    const mediaLocalPath = req.file?.path;

    if (!mediaLocalPath) {
      return res.status(400).json({ success: false, message: 'Media file is required.' });
    }

    const media = await uploadOnCloudinary(mediaLocalPath);
    if (!media) {
      return res.status(500).json({ success: false, message: 'Failed to upload media.' });
    }

    const newMediaItem = {
      url: media.secure_url,
      public_id: media.public_id,
    };

    // Find the user's existing story document or create a new one
    await Story.findOneAndUpdate(
      { author: authorId },
      {
        $push: { media: newMediaItem },
        // Reset the expiration date every time a new story is added
        $set: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) }
      },
      { upsert: true, new: true } // `upsert: true` creates the document if it doesn't exist
    );

    return res.status(201).json({ success: true, message: 'Story added successfully.' });
  } catch (error) {
    console.error('Error adding story:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const getStoriesFeed = async (req, res) => {
    try {
        const currentUser = req.user;
        const followingIds = currentUser.following;

        const stories = await Story.find({ author: { $in: followingIds } })
            .populate('author', 'username profilePicture');

        res.status(200).json({ success: true, stories });
    } catch (error) {
        console.error('Error fetching stories feed:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};