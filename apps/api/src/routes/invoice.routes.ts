import { createInvoiceSchema, createPaymentSchema, invoiceQuerySchema, updateInvoiceSchema } from '@financeos/shared';
import { Router } from 'express';

import { asyncHandler } from '../lib/async-handler';
import * as invoiceController from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', validateQuery(invoiceQuerySchema), asyncHandler(invoiceController.listInvoices));
router.post('/', validateBody(createInvoiceSchema), asyncHandler(invoiceController.createInvoice));
router.get('/:id', asyncHandler(invoiceController.getInvoice));
router.patch('/:id', validateBody(updateInvoiceSchema), asyncHandler(invoiceController.updateInvoice));
router.delete('/:id', asyncHandler(invoiceController.deleteInvoice));
router.post('/:id/send', asyncHandler(invoiceController.sendInvoice));
router.post('/:id/cancel', asyncHandler(invoiceController.cancelInvoice));
router.post('/:id/payments', validateBody(createPaymentSchema), asyncHandler(invoiceController.recordPayment));
router.get('/:id/pdf', asyncHandler(invoiceController.getInvoicePdf));

export default router;
