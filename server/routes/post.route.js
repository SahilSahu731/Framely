import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';
import { addComment, createPost } from '../controllers/post.controller.js';

const router = express.Router();

// This line ensures that a user must be logged in for all post-related actions
router.use(protect);

router.post('/create', upload.single('postImage'), createPost);

router.post('/:postId/comment', addComment);

export default router;