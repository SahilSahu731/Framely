import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import { setNotifications, addNotification } from '../store/slices/notificationSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch initial notifications
    const fetchInitialNotifications = async () => {
      try {
        const { data } = await axios.get('/api/notifications', { withCredentials: true });
        if (data.success) {
          dispatch(setNotifications(data.notifications));
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchInitialNotifications();

    // 2. Connect to Socket.IO server
    const socket = io('http://localhost:5000'); // Your server URL

    // 3. Join the personal room
    socket.emit('joinRoom', user._id);

    // 4. Listen for new notifications
    socket.on('newNotification', (notification) => {
      dispatch(addNotification(notification));
      // Optionally, show a toast notification here
    });

    // 5. Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [user, dispatch]);
};

export default useNotifications;