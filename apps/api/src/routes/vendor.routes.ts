import { Router } from 'express';

import { createVendorSchema } from '@financeos/shared';

import * as vendorController from '../controllers/vendor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', vendorController.listVendors);
router.post('/', validateBody(createVendorSchema), vendorController.createVendor);

export default router;
