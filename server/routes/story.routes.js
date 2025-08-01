import express from 'express';
import { addStory, getStoriesFeed } from '../controllers/story.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.use(protect);

router.post('/add', upload.single('storyMedia'), addStory);
router.get('/', getStoriesFeed);

export default router;