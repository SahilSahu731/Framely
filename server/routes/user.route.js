import express from 'express';
import { getUserProfile, followUnfollowUser, searchUsers, getUsersForSidebar, getAllUsers } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes in this file require the user to be logged in
router.use(protect);

router.get('/conversations', getUsersForSidebar);
router.get('/', getAllUsers);


// The order is important: dynamic routes should come after static ones if they conflict
router.get('/profile/:username', getUserProfile);
router.post('/follow/:userId', followUnfollowUser);
router.get('/search', searchUsers);


export default router;