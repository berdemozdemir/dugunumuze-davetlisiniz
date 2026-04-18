import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { patchInvitationOverrides } from './patch-invitation-overrides';
import { invitationCoverFormSchema } from '../schemas/invitation-cover-form';
import { orpc_updateWeddingPartnerNames } from '@/modules/weddings/update-wedding-partners';
import { err } from '@/lib/result';

export const orpc_invitation_updateCover = procedure_protected
  .input(
    z
      .object({
        weddingSlug: z.string().min(1),
      })
      .merge(invitationCoverFormSchema),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const {
      weddingSlug,
      partner1Name,
      partner2Name,
      heroImageUri,
      heroEyebrow,
      heroTagline,
      heroDateLine,
    } = input;

    const [partnersErr] = await orpc_updateWeddingPartnerNames({
      weddingSlug,
      partner1Name,
      partner2Name,
    });
    if (partnersErr) {
      return err({
        reason: 'update-failed',
        message: partnersErr.message,
      });
    }

    return patchInvitationOverrides({
      db,
      auth,
      weddingSlug,
      patch: {
        heroImageUri,
        heroEyebrow,
        heroTagline,
        heroDateLine,
      },
    });
  })
  .callable();
