import { z } from 'zod';

export const createEventSchema = z.object({
  partner1Name: z.string().min(1, 'İsim gerekli'),
  partner2Name: z.string().min(1, 'İsim gerekli'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
