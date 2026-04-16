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
});
