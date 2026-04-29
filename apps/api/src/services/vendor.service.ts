import type { CreateVendorInput } from '@financeos/shared';

import { createPaginatedResult } from '../lib/pagination';
import { prisma } from '../lib/prisma';
import { serializeVendor } from '../lib/serializers';

export const listVendors = async (userId: string) => {
  const vendors = await prisma.vendor.findMany({
    where: { userId, deletedAt: null },
    orderBy: { name: 'asc' },
  });

  return createPaginatedResult(vendors.map(serializeVendor), 1, vendors.length, vendors.length);
};

export const createVendor = async (userId: string, input: CreateVendorInput) => {
  const vendor = await prisma.vendor.create({
    data: {
      userId,
      ...input,
    } as any,
  });

  return serializeVendor(vendor);
};
