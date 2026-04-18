import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { syncWeddingRowFromCountdownEvents } from '@/modules/weddings/sync-wedding-from-countdown-events';
import { patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationCountdownFormSchema } from '../schemas/invitation-countdown-form';

export const orpc_invitation_updateCountdown = procedure_protected
  .input(
    z
      .object({
        weddingSlug: z.string().min(1),
      })
      .merge(invitationCountdownFormSchema),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const { weddingSlug, countdownEvents } = input;
    const patchResult = await patchInvitationOverrides({
      db,
      auth,
      weddingSlug,
      patch: { countdownEvents },
    });
    if (patchResult[0] !== null) {
      return patchResult;
    }
    return syncWeddingRowFromCountdownEvents({
      db,
      auth,
      weddingSlug,
      countdownEvents,
    });
  })
  .callable();
