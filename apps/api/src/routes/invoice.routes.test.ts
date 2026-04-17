import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listInvoicesMock = vi.fn();
const getInvoiceByIdMock = vi.fn();
const createInvoiceMock = vi.fn();
const updateInvoiceMock = vi.fn();
const deleteInvoiceMock = vi.fn();
const sendInvoiceMock = vi.fn();
const cancelInvoiceMock = vi.fn();
const recordPaymentMock = vi.fn();
const renderInvoicePdfMock = vi.fn();

vi.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    (req as express.Request & { user: { userId: string; email: string } }).user = {
      userId: 'usr_test',
      email: 'test@example.com',
    };
    next();
  },
}));

vi.mock('../services/invoice.service', () => ({
  listInvoices: listInvoicesMock,
  getInvoiceById: getInvoiceByIdMock,
  createInvoice: createInvoiceMock,
  updateInvoice: updateInvoiceMock,
  deleteInvoice: deleteInvoiceMock,
  sendInvoice: sendInvoiceMock,
  cancelInvoice: cancelInvoiceMock,
  recordPayment: recordPaymentMock,
}));

vi.mock('../services/pdf/invoice.pdf', () => ({
  renderInvoicePdf: renderInvoicePdfMock,
}));

describe('invoice routes', () => {
  let app: express.Express;

  beforeEach(async () => {
    listInvoicesMock.mockReset();
    getInvoiceByIdMock.mockReset();
    createInvoiceMock.mockReset();
    updateInvoiceMock.mockReset();
    deleteInvoiceMock.mockReset();
    sendInvoiceMock.mockReset();
    cancelInvoiceMock.mockReset();
    recordPaymentMock.mockReset();
    renderInvoicePdfMock.mockReset();

    app = express();
    app.use(express.json());

    const { default: invoiceRoutes } = await import('./invoice.routes');
    app.use('/invoices', invoiceRoutes);
  });

  it('sends an invoice', async () => {
    sendInvoiceMock.mockResolvedValue({ id: 'inv_1', status: 'SENT' });

    const response = await request(app).post('/invoices/inv_1/send');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendInvoiceMock).toHaveBeenCalledWith('usr_test', 'inv_1');
  });

  it('cancels an invoice', async () => {
    cancelInvoiceMock.mockResolvedValue({ id: 'inv_1', status: 'CANCELLED' });

    const response = await request(app).post('/invoices/inv_1/cancel');

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('CANCELLED');
  });

  it('records a payment', async () => {
    recordPaymentMock.mockResolvedValue({ id: 'inv_1', status: 'PARTIALLY_PAID', amountPaid: '50.00' });

    const response = await request(app).post('/invoices/inv_1/payments').send({
      amount: '50.00',
      paidAt: '2026-04-16T00:00:00.000Z',
      method: 'ACH',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('PARTIALLY_PAID');
  });

  it('streams a PDF when available', async () => {
    getInvoiceByIdMock.mockResolvedValue({
      id: 'inv_1',
      invoiceNumber: 'INV-2026-0001',
      clientId: 'cli_1',
      clientName: 'Atlas Creative',
      status: 'SENT',
      issueDate: '2026-04-01T00:00:00.000Z',
      dueDate: '2026-04-30T00:00:00.000Z',
      subtotal: '100.00',
      taxRate: '0.00',
      taxAmount: '0.00',
      total: '100.00',
      amountPaid: '0.00',
      notes: null,
      lineItems: [],
      payments: [],
    });
    renderInvoicePdfMock.mockResolvedValue(Buffer.from('pdf'));

    const response = await request(app).get('/invoices/inv_1/pdf');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/pdf');
  });
});
