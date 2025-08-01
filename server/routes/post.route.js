import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';
import { addComment, createPost, deletePost, getAllPosts, toggleLikeOnPost } from '../controllers/post.controller.js';

const router = express.Router();

// This line ensures that a user must be logged in for all post-related actions
router.use(protect);

router.get('/', getAllPosts); // <-- Add this line


router.post('/create', upload.single('postImage'), createPost);

router.post('/:postId/comment', addComment);

router.post('/:postId/like', toggleLikeOnPost);

router.delete('/:postId', deletePost);


export default router;