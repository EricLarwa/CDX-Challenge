import { Prisma } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';

import { HttpError } from '../lib/http-error';

import { errorMiddleware } from './error.middleware';

function createResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };

  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);

  return response;
}

describe('error middleware', () => {
  it('returns HttpError status and message', () => {
    const res = createResponse();

    errorMiddleware(new HttpError('Nope', 418), {} as never, res as never, vi.fn());

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Nope' });
  });

  it('returns helpful message for Prisma connection failures', () => {
    const res = createResponse();
    const error = new Prisma.PrismaClientInitializationError('db down', '6.19.3');

    errorMiddleware(error, {} as never, res as never, vi.fn());

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Database connection failed. Make sure Postgres is running and the API DATABASE_URL is correct.',
    });
  });

  it('returns helpful message for Prisma schema mismatches', () => {
    const res = createResponse();
    const error = new Prisma.PrismaClientKnownRequestError('Missing column', {
      code: 'P2022',
      clientVersion: '6.19.3',
    });

    errorMiddleware(error, {} as never, res as never, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Database schema is out of date. Run the FinanceOS Prisma migration and seed steps, then restart the API.',
    });
  });
});
