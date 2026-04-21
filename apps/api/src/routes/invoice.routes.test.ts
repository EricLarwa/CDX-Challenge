import type { Request, Response } from 'express';
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

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    auth: {
      userId: 'usr_test',
      email: 'test@example.com',
    },
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as Request;
}

function createMockResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
    setHeader: vi.fn(),
  } as unknown as Response;

  (response.status as unknown as ReturnType<typeof vi.fn>).mockReturnValue(response);
  (response.json as unknown as ReturnType<typeof vi.fn>).mockReturnValue(response);
  (response.send as unknown as ReturnType<typeof vi.fn>).mockReturnValue(response);

  return response;
}

describe('invoice routes', () => {
  beforeEach(() => {
    listInvoicesMock.mockReset();
    getInvoiceByIdMock.mockReset();
    createInvoiceMock.mockReset();
    updateInvoiceMock.mockReset();
    deleteInvoiceMock.mockReset();
    sendInvoiceMock.mockReset();
    cancelInvoiceMock.mockReset();
    recordPaymentMock.mockReset();
    renderInvoicePdfMock.mockReset();
  });

  it('sends an invoice', async () => {
    sendInvoiceMock.mockResolvedValue({ id: 'inv_1', status: 'SENT' });
    const req = createMockRequest({ params: { id: 'inv_1' } });
    const res = createMockResponse();
    const controller = await import('../controllers/invoice.controller.js');

    await controller.sendInvoice(req, res);

    expect(sendInvoiceMock).toHaveBeenCalledWith('usr_test', 'inv_1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 'inv_1', status: 'SENT' },
    });
  });

  it('lists invoices with normalized pagination and filters', async () => {
    listInvoicesMock.mockResolvedValue({ items: [], page: 1, pageSize: 20, total: 0 });
    const req = createMockRequest({
      query: {
        page: '1',
        pageSize: '20',
        search: 'Atlas',
        status: 'SENT',
      },
    });
    const res = createMockResponse();
    const controller = await import('../controllers/invoice.controller.js');

    await controller.listInvoices(req, res);

    expect(listInvoicesMock).toHaveBeenCalledWith('usr_test', {
      page: '1',
      pageSize: '20',
      search: 'Atlas',
      status: 'SENT',
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('cancels an invoice', async () => {
    cancelInvoiceMock.mockResolvedValue({ id: 'inv_1', status: 'CANCELLED' });
    const req = createMockRequest({ params: { id: 'inv_1' } });
    const res = createMockResponse();
    const controller = await import('../controllers/invoice.controller.js');

    await controller.cancelInvoice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 'inv_1', status: 'CANCELLED' },
    });
  });

  it('records a payment', async () => {
    recordPaymentMock.mockResolvedValue({ id: 'inv_1', status: 'PARTIALLY_PAID', amountPaid: '50.00' });
    const req = createMockRequest({
      params: { id: 'inv_1' },
      body: {
        amount: '50.00',
        paidAt: '2026-04-16T00:00:00.000Z',
        method: 'ACH',
      },
    });
    const res = createMockResponse();
    const controller = await import('../controllers/invoice.controller.js');

    await controller.recordPayment(req, res);

    expect(recordPaymentMock).toHaveBeenCalledWith('usr_test', 'inv_1', {
      amount: '50.00',
      paidAt: '2026-04-16T00:00:00.000Z',
      method: 'ACH',
    });
    expect(res.status).toHaveBeenCalledWith(201);
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
    const req = createMockRequest({ params: { id: 'inv_1' } });
    const res = createMockResponse();
    const controller = await import('../controllers/invoice.controller.js');

    await controller.getInvoicePdf(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(res.send).toHaveBeenCalledWith(Buffer.from('pdf'));
  });
});
