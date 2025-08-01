import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    media: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      index: { expires: '1s' },
    },
  },
  { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);
export default Story;