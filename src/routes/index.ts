import { Router } from 'express';
import UserRouter from './Users';
import FeedRouter from './Feeds';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/feeds', FeedRouter);

// Export the base-router
export default router;
