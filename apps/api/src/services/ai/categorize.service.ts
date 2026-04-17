import Anthropic from '@anthropic-ai/sdk';

import { env } from '../../lib/env';

const fallbackCategoryFromDescription = (description: string) => {
  const normalized = description.toLowerCase();

  if (normalized.includes('flight') || normalized.includes('hotel') || normalized.includes('train')) {
    return 'TRAVEL' as const;
  }

  if (normalized.includes('figma') || normalized.includes('linear') || normalized.includes('software')) {
    return 'SOFTWARE' as const;
  }

  if (normalized.includes('meal') || normalized.includes('dinner') || normalized.includes('lunch')) {
    return 'MEALS' as const;
  }

  if (normalized.includes('contractor') || normalized.includes('freelancer')) {
    return 'CONTRACTORS' as const;
  }

  if (normalized.includes('ad') || normalized.includes('marketing')) {
    return 'MARKETING' as const;
  }

  return 'OTHER' as const;
};

let anthropicClient: Anthropic | null = null;

const getAnthropicClient = () => {
  if (!env.anthropicApiKey || !env.aiEnabled) {
    return null;
  }

  anthropicClient ??= new Anthropic({ apiKey: env.anthropicApiKey });
  return anthropicClient;
};

export const categorizeExpenseDescription = async (description: string) => {
  const fallback = fallbackCategoryFromDescription(description);
  const client = getAnthropicClient();

  if (!client) {
    return { category: fallback, source: 'fallback' as const };
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 32,
      temperature: 0,
      system:
        'Categorize business expenses. Reply with only one uppercase category from: SOFTWARE, TRAVEL, MEALS, EQUIPMENT, CONTRACTORS, UTILITIES, MARKETING, TAXES, INSURANCE, OTHER.',
      messages: [{ role: 'user', content: description }],
    });

    const text = response.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join(' ')
      .trim()
      .toUpperCase();

    const category = [
      'SOFTWARE',
      'TRAVEL',
      'MEALS',
      'EQUIPMENT',
      'CONTRACTORS',
      'UTILITIES',
      'MARKETING',
      'TAXES',
      'INSURANCE',
      'OTHER',
    ].includes(text)
      ? (text as
          | 'SOFTWARE'
          | 'TRAVEL'
          | 'MEALS'
          | 'EQUIPMENT'
          | 'CONTRACTORS'
          | 'UTILITIES'
          | 'MARKETING'
          | 'TAXES'
          | 'INSURANCE'
          | 'OTHER')
      : fallback;

    return { category, source: category === fallback ? ('fallback' as const) : ('ai' as const) };
  } catch (error) {
    console.error('Expense categorization failed, falling back to rules.', error);
    return { category: fallback, source: 'fallback' as const };
  }
};
