import { createVendorSchema } from '@financeos/shared';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import * as vendorController from '../controllers/vendor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(vendorController.listVendors));
router.post('/', validateBody(createVendorSchema), asyncHandler(vendorController.createVendor));

export default router;
