import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok } from '@/lib/result';
import { loadOwnerInvitationMergeForEvent } from '@/modules/templates/actions/load-owner-invitation-merge';
import z from 'zod';

export const orpc_templates_getEventInvitationSettings = procedure_protected
  .input(
    z.object({
      eventSlug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const loaded = await loadOwnerInvitationMergeForEvent(
      db,
      auth,
      input.eventSlug,
    );
    if (loaded[0]) {
      return err(loaded[0]);
    }
    const { eventId, defaults, overrides, merged } = loaded[1];

    return ok({
      eventId,
      defaults,
      overrides,
      merged,
    });
  })
  .callable();
