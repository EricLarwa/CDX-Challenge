import { createClientSchema, updateClientSchema } from '@financeos/shared';
import { Router } from 'express';


import * as clientController from '../controllers/client.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', clientController.listClients);
router.post('/', validateBody(createClientSchema), clientController.createClient);
router.get('/:id', clientController.getClient);
router.patch('/:id', validateBody(updateClientSchema), clientController.updateClient);

export default router;
