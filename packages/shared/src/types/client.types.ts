import type { z } from 'zod';

import type { createClientSchema, updateClientSchema } from '../schemas/client.schema';

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
