import { z } from 'zod';

/** Yalnızca çift isimleri; tarih/konum etkinlikler veya sunucu varsayılanlarından gelir. */
export const createWeddingSchema = z.object({
  partner1Name: z.string().min(1, 'Partner 1 name is required'),
  partner2Name: z.string().min(1, 'Partner 2 name is required'),
});

export type CreateWeddingSchema = z.infer<typeof createWeddingSchema>;
