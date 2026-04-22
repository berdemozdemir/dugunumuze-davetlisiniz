import z from 'zod';
import { RSVP_MAX_COMPANIONS } from '@/modules/rsvp/constants';
import { rsvpCompanionFormSchema } from '@/modules/rsvp/schemas/rsvp-companion-form';

export const rsvpSubmitFormSchema = z.object({
  primaryFullName: z
    .string()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır')
    .max(200, 'Ad soyad en fazla 200 karakter olabilir'),
  primaryPhone: z
    .string()
    .min(8, 'Cep telefonu en az 8 karakter olmalıdır')
    .max(32, 'Cep telefonu en fazla 32 karakter olabilir'),
  companions: z
    .array(rsvpCompanionFormSchema)
    .max(RSVP_MAX_COMPANIONS, 'En fazla 20 yan misafir ekleyebilirsiniz'),
  note: z.string().max(2000, 'Not en fazla 2000 karakter olabilir').optional(),
});

export type RsvpSubmitFormValues = z.infer<typeof rsvpSubmitFormSchema>;
