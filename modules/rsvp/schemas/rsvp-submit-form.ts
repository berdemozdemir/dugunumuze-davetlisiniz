import z from 'zod';
import { RSVP_MAX_COMPANIONS } from '@/modules/rsvp/constants';
import { rsvpCompanionFormSchema } from '@/modules/rsvp/schemas/rsvp-companion-form';

export const rsvpSubmitFormSchema = z.object({
  primaryFullName: z.string().min(2).max(200),
  primaryPhone: z.string().min(8).max(32),
  companions: z.array(rsvpCompanionFormSchema).max(RSVP_MAX_COMPANIONS),
  note: z.string().max(2000).optional(),
});

export type RsvpSubmitFormValues = z.infer<typeof rsvpSubmitFormSchema>;
