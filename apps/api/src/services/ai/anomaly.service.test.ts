import { beforeEach, describe, expect, it, vi } from 'vitest';

const findManyMock = vi.fn();

vi.mock('../../lib/prisma', () => ({
  prisma: {
    expense: {
      findMany: findManyMock,
    },
  },
}));

describe('detectExpenseAnomalies', () => {
  beforeEach(() => {
    findManyMock.mockReset();
  });

  it('returns no anomalies when no vendor is provided', async () => {
    const { detectExpenseAnomalies } = await import('./anomaly.service.js');

    await expect(
      detectExpenseAnomalies({
        userId: 'usr_1',
        amount: 100,
        date: '2026-04-16T00:00:00.000Z',
      }),
    ).resolves.toEqual([]);
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it('flags duplicate charges within seven days', async () => {
    findManyMock.mockResolvedValue([
      {
        amount: 125,
      },
    ]);

    const { detectExpenseAnomalies } = await import('./anomaly.service.js');

    const result = await detectExpenseAnomalies({
      userId: 'usr_1',
      vendorId: 'ven_1',
      amount: 125,
      date: '2026-04-16T00:00:00.000Z',
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'duplicate_charge',
        }),
      ]),
    );
  });

  it("flags vendor spikes above twice the vendor's average", async () => {
    findManyMock.mockResolvedValue([
      { amount: 50 },
      { amount: 60 },
      { amount: 40 },
    ]);

    const { detectExpenseAnomalies } = await import('./anomaly.service.js');

    const result = await detectExpenseAnomalies({
      userId: 'usr_1',
      vendorId: 'ven_1',
      amount: 140,
      date: '2026-04-16T00:00:00.000Z',
    });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'vendor_spike',
        }),
      ]),
    );
  });
});
