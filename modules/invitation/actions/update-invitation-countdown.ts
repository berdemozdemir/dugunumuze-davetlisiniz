import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { syncEventRowFromCountdownEvents } from '@/modules/events/sync-event-from-countdown-events';
import { patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationCountdownFormSchema } from '../schemas/invitation-countdown-form';

export const orpc_invitation_updateCountdown = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationCountdownFormSchema),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const { eventSlug, countdownEvents } = input;
    const patchResult = await patchInvitationOverrides({
      db,
      auth,
      eventSlug,
      patch: { countdownEvents },
    });
    if (patchResult[0] !== null) {
      return patchResult;
    }
    return syncEventRowFromCountdownEvents({
      db,
      auth,
      eventSlug,
      countdownEvents,
    });
  })
  .callable();
