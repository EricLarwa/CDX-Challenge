import { Router } from 'express';

import * as dashboardController from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(dashboardController.getDashboard));

export default router;
