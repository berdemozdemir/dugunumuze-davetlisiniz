import z from 'zod';

export const countdownEventSchema = z.object({
  title: z.string().min(1).max(160),
  dateTime: z
    .string()
    .min(1)
    .refine(
      (s) => !Number.isNaN(Date.parse(s)),
      'Geçerli bir tarih/saat girin',
    ),
  subtitle: z.string().max(400).optional(),
  venueName: z.string().max(200).optional(),
  /** TODO: İsteğe bağlı; ileride harita seçimi. */
  addressText: z.string().max(500).optional(),
  city: z.string().max(120).optional(),
});
