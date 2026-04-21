import type { z } from 'zod';

import type { createVendorSchema, updateVendorSchema } from '../schemas/vendor.schema.js';

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
