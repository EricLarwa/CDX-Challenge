import type { CreateVendorInput } from '@financeos/shared';

import { createPaginatedResult } from '../lib/pagination.js';
import { prisma } from '../lib/prisma.js';
import { serializeVendor } from '../lib/serializers.js';

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
      user: { connect: { id: userId } },
      name: input.name,
      category: input.category,
      email: input.email,
      notes: input.notes,
    },
  });

  return serializeVendor(vendor);
};
