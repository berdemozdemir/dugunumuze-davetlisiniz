import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationVisibilityFormSchema } from '../schemas/invitation-visibility-form';

export const orpc_invitation_updateVisibility = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationVisibilityFormSchema),
  )
  .handler(async ({ input }) => {
    const { eventSlug, ...patch } = input;
    return orpc_patchInvitationOverrides({
      eventSlug,
      patch,
    });
  })
  .callable();
