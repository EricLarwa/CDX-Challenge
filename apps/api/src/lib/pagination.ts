import type { PaginatedResult } from '@financeos/shared';

export const createPaginatedResult = <T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number,
): PaginatedResult<T> => ({
  items,
  page,
  pageSize,
  total,
});
