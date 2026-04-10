import { z } from 'zod';

export const updateWeddingSchema = z.object({
  weddingSlug: z.string().min(1),

  partner1Name: z.string().min(1, 'Partner 1 name is required'),
  partner2Name: z.string().min(1, 'Partner 2 name is required'),

  dateTime: z.string().min(1, 'Date/time is required'),

  city: z.string().min(1, 'City is required'),
  venueName: z.string(),
  addressText: z.string().min(1, 'Address is required'),
});

export type UpdateWeddingSchema = z.infer<typeof updateWeddingSchema>;

