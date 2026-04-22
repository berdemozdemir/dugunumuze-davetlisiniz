import z from 'zod';

/** Yan misafir satırı (ad zorunlu, telefon opsiyonel). */
export const rsvpCompanionFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(200, 'Ad soyad en fazla 200 karakter olabilir'),
  phone: z
    .string()
    .max(32, 'Telefon en fazla 32 karakter olabilir')
    .optional()
    .nullable(),
});

export type RsvpCompanionFormValues = z.infer<typeof rsvpCompanionFormSchema>;
