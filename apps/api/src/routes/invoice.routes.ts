import { Router } from 'express';

import { createInvoiceSchema, createPaymentSchema, invoiceQuerySchema, updateInvoiceSchema } from '@financeos/shared';

import * as invoiceController from '../controllers/invoice.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';

const router = Router();

router.get('/', validateQuery(invoiceQuerySchema), invoiceController.listInvoices);
router.post('/', validateBody(createInvoiceSchema), invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.patch('/:id', validateBody(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.post('/:id/send', invoiceController.sendInvoice);
router.post('/:id/payments', validateBody(createPaymentSchema), invoiceController.recordPayment);
router.get('/:id/pdf', invoiceController.getInvoicePdf);

export default router;
