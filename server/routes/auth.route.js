import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile, changeProfilePhoto, changeProfileStatus } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.put('/update-profile',protect, updateProfile);
router.put('/change-profile-photo',protect, upload.single('profilePicture'), changeProfilePhoto);
router.put('/change-status',protect, changeProfileStatus);

export default router;