import { Router } from 'express';
import UserRouter from './Users';
import FeedRouter from './Feeds';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', UserRouter);
router.use('/feed', FeedRouter);

// Export the base-router
export default router;
