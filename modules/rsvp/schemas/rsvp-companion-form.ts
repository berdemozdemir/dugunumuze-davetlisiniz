import z from 'zod';

/** Yan misafir satırı (ad zorunlu, telefon opsiyonel). */
export const rsvpCompanionFormSchema = z.object({
  fullName: z.string().min(2).max(200),
  phone: z.string().max(32).optional().nullable(),
});

export type RsvpCompanionFormValues = z.infer<typeof rsvpCompanionFormSchema>;
