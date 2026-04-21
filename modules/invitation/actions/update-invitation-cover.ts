import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { orpc_patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationCoverFormSchema } from '../schemas/invitation-cover-form';
import { orpc_updateEventPartnerNames } from '@/modules/events/update-event-partners';
import { err } from '@/lib/result';

export const orpc_invitation_updateCover = procedure_protected
  .input(
    z
      .object({
        eventSlug: z.string().min(1),
      })
      .merge(invitationCoverFormSchema),
  )
  .handler(async ({ input }) => {
    const {
      eventSlug,
      partner1Name,
      partner2Name,
      heroImageUri,
      heroEyebrow,
      heroTagline,
      heroDateLine,
    } = input;

    const [partnersErr] = await orpc_updateEventPartnerNames({
      eventSlug,
      partner1Name,
      partner2Name,
    });
    if (partnersErr) {
      return err({
        reason: 'update-failed',
        message: partnersErr.message,
      });
    }

    return orpc_patchInvitationOverrides({
      eventSlug,
      patch: {
        heroImageUri,
        heroEyebrow,
        heroTagline,
        heroDateLine,
      },
    });
  })
  .callable();
