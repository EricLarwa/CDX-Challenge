import { describe, expect, it } from 'vitest';

import { categorizeExpenseDescription } from './categorize.service.js';

describe('categorizeExpenseDescription', () => {
  it('falls back to TRAVEL for travel-like descriptions when AI is unavailable', async () => {
    await expect(categorizeExpenseDescription('Hotel and train for client workshop')).resolves.toMatchObject({
      category: 'TRAVEL',
      source: 'fallback',
    });
  });

  it('falls back to SOFTWARE for software subscriptions', async () => {
    await expect(categorizeExpenseDescription('Figma software subscription')).resolves.toMatchObject({
      category: 'SOFTWARE',
      source: 'fallback',
    });
  });

  it('falls back to OTHER when no heuristic matches', async () => {
    await expect(categorizeExpenseDescription('Office shelf organizer')).resolves.toMatchObject({
      category: 'OTHER',
      source: 'fallback',
    });
  });
});
