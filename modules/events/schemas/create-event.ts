import { z } from 'zod';

export const createEventSchema = z.object({
  templateKey: z.string().min(1, 'Etkinlik türü gerekli'),
  primaryName: z.string().min(1, 'İsim gerekli'),
  secondaryName: z.string().optional(),
  dateTimeIso: z.string().min(1, 'Tarih gerekli'),
  city: z.string().min(1, 'Şehir gerekli'),
  addressText: z.string().min(1, 'Adres gerekli'),
  venueName: z.string().optional(),
});

export type CreateEventSchema = z.infer<typeof createEventSchema>;
