import z from 'zod';
import { COUNTDOWN_EVENTS_MAX } from '@/modules/invitation/constants';
import { countdownEventSchema } from '@/modules/templates/schemas/count-down-event';

export const invitationCountdownFormSchema = z.object({
  countdownEvents: z
    .array(countdownEventSchema)
    .max(COUNTDOWN_EVENTS_MAX)
    .optional(),
});

export type InvitationCountdownFormSchema = z.infer<
  typeof invitationCountdownFormSchema
>;
