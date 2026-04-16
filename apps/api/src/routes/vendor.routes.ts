import { Router } from 'express';

import { createVendorSchema } from '@financeos/shared';

import * as vendorController from '../controllers/vendor.controller';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.get('/', vendorController.listVendors);
router.post('/', validateBody(createVendorSchema), vendorController.createVendor);

export default router;
