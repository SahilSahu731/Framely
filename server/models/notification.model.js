import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // Optional: Link to the content that triggered the notification
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Can refer to a Post for likes/comments
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;