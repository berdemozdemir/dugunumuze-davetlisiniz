import z from 'zod';
import { countdownEventSchema } from '@/modules/templates/schemas/count-down-event';

export const invitationCountdownFormSchema = z.object({
  countdownEvent: countdownEventSchema,
});

export type InvitationCountdownFormSchema = z.infer<
  typeof invitationCountdownFormSchema
>;
