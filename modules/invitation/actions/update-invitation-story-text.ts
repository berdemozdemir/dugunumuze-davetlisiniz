import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationStoryTextFormSchema } from '../schemas/invitation-story-text-form';

export const orpc_invitation_updateStoryText = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationStoryTextFormSchema),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const { eventSlug, ...patch } = input;
    return patchInvitationOverrides({
      db,
      auth,
      eventSlug,
      patch,
    });
  })
  .callable();
