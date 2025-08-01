import express from 'express';
import { getNotifications, markNotificationsAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All notification routes require a user to be logged in
router.use(protect);

// Route to get all notifications
router.get('/', getNotifications);

// Route to mark all notifications as read
router.post('/read', markNotificationsAsRead);

export default router;