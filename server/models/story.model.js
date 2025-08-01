import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user can only have one active "Story" document
    },
    media: [
      {
        url: {
          type: String, // URL from Cloudinary
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // This field will be used to automatically delete stories after 24 hours
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default to 24 hours from now
      index: { expires: '1s' }, // MongoDB's TTL (Time-To-Live) index
    },
  },
  { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);
export default Story;