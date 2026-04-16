import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationClosingFormSchema } from '../schemas/invitation-closing-form';

export const orpc_invitation_updateClosing = procedure_protected
  .input(
    z
      .object({
        weddingSlug: z.string().min(1),
      })
      .merge(invitationClosingFormSchema),
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
