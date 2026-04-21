import { createClientSchema, updateClientSchema } from '@financeos/shared';
import { Router } from 'express';

import * as clientController from '../controllers/client.controller.js';
import { asyncHandler } from '../lib/async-handler.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', asyncHandler(clientController.listClients));
router.post('/', validateBody(createClientSchema), asyncHandler(clientController.createClient));
router.get('/:id', asyncHandler(clientController.getClient));
router.patch('/:id', validateBody(updateClientSchema), asyncHandler(clientController.updateClient));

export default router;
