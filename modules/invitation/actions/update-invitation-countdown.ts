import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { syncEventRowFromCountdownEvent } from '@/modules/events/sync-event-from-countdown-events';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
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
    const { eventSlug, countdownEvent } = input;
    const patchResult = await orpc_patchInvitationOverrides({
      eventSlug,
      patch: { countdownEvent },
    });
    if (patchResult[0] !== null) {
      return patchResult;
    }
    return syncEventRowFromCountdownEvent({
      db,
      auth,
      eventSlug,
      countdownEvent,
    });
  })
  .callable();
