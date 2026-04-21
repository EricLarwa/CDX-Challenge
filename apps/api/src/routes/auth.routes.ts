import { loginSchema, registerSchema } from '@financeos/shared';
import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
router.post('/logout', authMiddleware, asyncHandler(authController.logout));
router.get('/me', authMiddleware, asyncHandler(authController.getCurrentUser));

export default router;
