// server/models/post.model.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
     image: {
      url: {
        type: String, // URL from Cloudinary
        required: true,
      },
      public_id: {
        type: String, // The ID needed to delete from Cloudinary
        required: true,
      },
    },
    caption: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
