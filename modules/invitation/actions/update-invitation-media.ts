import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationMediaFormSchema } from '../schemas/invitation-media-form';

export const orpc_invitation_updateMedia = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationMediaFormSchema),
  )
  .handler(async ({ input }) => {
    const { eventSlug, ...patch } = input;
    return orpc_patchInvitationOverrides({
      eventSlug,
      patch,
    });
  })
  .callable();
