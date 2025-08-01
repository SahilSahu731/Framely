import Notification from '../models/notification.model.js';

/**
 * @description Get all notifications for the logged-in user
 * @route GET /api/notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .populate({
          path: 'sender',
          select: 'username profilePicture' 
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};


export const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    // Update all unread notifications for the user
    await Notification.updateMany(
      { receiver: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({ success: true, message: 'Notifications marked as read.' });

  } catch (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};