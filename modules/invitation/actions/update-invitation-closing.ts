import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationClosingFormSchema } from '../schemas/invitation-closing-form';

export const orpc_invitation_updateClosing = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationClosingFormSchema),
  )
  .handler(async ({ input }) => {
    const { eventSlug, ...patch } = input;
    return orpc_patchInvitationOverrides({
      eventSlug,
      patch,
    });
  })
  .callable();
