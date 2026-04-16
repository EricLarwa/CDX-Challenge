import { createInvoiceSchema, createPaymentSchema, invoiceQuerySchema, updateInvoiceSchema } from '@financeos/shared';
import { Router } from 'express';


import * as invoiceController from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', validateQuery(invoiceQuerySchema), invoiceController.listInvoices);
router.post('/', validateBody(createInvoiceSchema), invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.patch('/:id', validateBody(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.post('/:id/send', invoiceController.sendInvoice);
router.post('/:id/payments', validateBody(createPaymentSchema), invoiceController.recordPayment);
router.get('/:id/pdf', invoiceController.getInvoicePdf);

export default router;
