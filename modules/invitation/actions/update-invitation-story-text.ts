import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationStoryTextFormSchema } from '../schemas/invitation-story-text-form';

export const orpc_invitation_updateStoryText = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationStoryTextFormSchema),
  )
  .handler(async ({ input }) => {
    const { eventSlug, ...patch } = input;
    return orpc_patchInvitationOverrides({
      eventSlug,
      patch,
    });
  })
  .callable();
