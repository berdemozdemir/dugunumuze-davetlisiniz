import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
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
    const { weddingSlug, ...patch } = input;
    return patchInvitationOverrides({
      db,
      auth,
      weddingSlug,
      patch,
    });
  })
  .callable();
