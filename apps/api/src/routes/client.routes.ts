import { Router } from 'express';

import { createClientSchema, updateClientSchema } from '@financeos/shared';

import * as clientController from '../controllers/client.controller';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.get('/', clientController.listClients);
router.post('/', validateBody(createClientSchema), clientController.createClient);
router.get('/:id', clientController.getClient);
router.patch('/:id', validateBody(updateClientSchema), clientController.updateClient);

export default router;
