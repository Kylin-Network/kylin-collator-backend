import { Router } from 'express';
import FeedRouter from './Feeds';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/feed', FeedRouter);

// Export the base-router
export default router;
