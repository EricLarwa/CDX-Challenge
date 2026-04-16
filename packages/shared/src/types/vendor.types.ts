import type { z } from 'zod';

import type { createVendorSchema, updateVendorSchema } from '../schemas/vendor.schema';

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
