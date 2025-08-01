import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Sets the initial notifications and calculates the unread count
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
    // Adds a new notification from a real-time event
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Add to the top of the list
      state.unreadCount += 1;
    },
    // Marks all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach(n => (n.read = true));
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;