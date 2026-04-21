import z from 'zod';

export const rsvpUpdateSettingsInputSchema = z.object({
  eventSlug: z.string().min(1),
  rsvpDeadlineIso: z
    .string()
    .min(1)
    .refine((s) => !Number.isNaN(Date.parse(s)), 'Geçerli bir tarih/saat'),
  rsvpMaxTotalGuests: z.number().int().min(1).max(500_000).nullable(),
  rsvpButtonLabel: z.string().max(80).optional(),
});

export type RsvpUpdateSettingsInput = z.infer<typeof rsvpUpdateSettingsInputSchema>;
