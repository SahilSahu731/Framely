import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NotificationPanel = ({ isOpen }) => {
  const { notifications } = useSelector((state) => state.notifications);

  if (!isOpen) return null;

  // A helper function to create notification messages
  const renderMessage = (n) => {
    switch (n.type) {
      case 'like':
        return `liked your post.`;
      case 'comment':
        return `commented on your post.`;
      case 'follow':
        return `started following you.`;
      default:
        return 'sent you a notification.';
    }
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 bg-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-600">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center p-4">No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n._id} className={`p-3 border-b border-gray-600 ${!n.read ? 'bg-sky-900/50' : ''}`}>
              <Link to={n.type === 'follow' ? `/profile/${n.sender.username}` : `/post/${n.contentId}`} className="flex items-center space-x-3">
                <img src={n.sender.profilePicture} alt={n.sender.username} className="w-10 h-10 rounded-full" />
                <p className="text-sm">
                  <span className="font-bold">{n.sender.username}</span> {renderMessage(n)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;