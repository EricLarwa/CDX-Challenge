import { Router } from 'express';

import * as dashboardController from '../controllers/dashboard.controller';
import { asyncHandler } from '../lib/async-handler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(dashboardController.getDashboard));

export default router;
