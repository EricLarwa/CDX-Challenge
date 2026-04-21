import { createVendorSchema } from '@financeos/shared';
import { Router } from 'express';

import * as vendorController from '../controllers/vendor.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(vendorController.listVendors));
router.post('/', validateBody(createVendorSchema), asyncHandler(vendorController.createVendor));

export default router;
