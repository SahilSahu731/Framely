import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setNotifications, markAllAsRead } from '../store/slices/notificationSlice';
import { NOTIFICATION_API_URL } from '../utils/constant';

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  // Fetch notifications when the page loads and mark them as read
  useEffect(() => {
    const fetchAndMarkRead = async () => {
      try {
        // Fetch all notifications
        const res = await axios.get(`${NOTIFICATION_API_URL}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications));
        }

        // After a short delay, mark them as read on the backend
        setTimeout(async () => {
          await axios.post(`${NOTIFICATION_API_URL}/read`, {}, { withCredentials: true });
          dispatch(markAllAsRead());
        }, 1500); // 1.5 second delay

      } catch (error) {
        console.error('Failed to fetch or update notifications:', error);
      }
    };

    fetchAndMarkRead();
  }, [dispatch]);

  const renderMessage = (n) => {
    switch (n.type) {
      case 'like': return `liked your post.`;
      case 'comment': return `commented on your post.`;
      case 'follow': return `started following you.`;
      default: return 'sent you a notification.';
    }
  };

  return (
    <div className="text-white max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Link
              to={n.type === 'follow' ? `/profile/${n.sender.username}` : `/post/${n.contentId}`}
              key={n._id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-colors hover:bg-gray-700 ${!n.read ? 'bg-sky-900/50' : 'bg-gray-800'}`}
            >
              <img src={n.sender.profilePicture} alt={n.sender.username} className="w-12 h-12 rounded-full object-cover" />
              <p className="text-sm">
                <span className="font-bold">{n.sender.username}</span> {renderMessage(n)}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-center p-8">You have no notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;