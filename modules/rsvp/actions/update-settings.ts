import { procedure_protected } from '@/integrations/orpc/procedure';
import { err } from '@/lib/result';
import { orpc_patchInvitationOverrides } from '@/modules/invitation/actions/patch-invitation-overrides';
import { loadOwnerInvitationMergeForEvent } from '@/modules/templates/actions/load-owner-invitation-merge';
import type { InvitationDefaults, InvitationOverrides } from '@/modules/templates/types';
import { deepMerge } from '@/modules/templates/utils/merge';
import { isRsvpDeadlineWithinBuffer } from '@/modules/rsvp/utils/validate-deadline';
import { rsvpUpdateSettingsInputSchema } from '@/modules/rsvp/schemas/rsvp-update-settings-input';

export const orpc_rsvp_updateSettings = procedure_protected
  .input(rsvpUpdateSettingsInputSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const { eventSlug, ...patchInput } = input;

    const loaded = await loadOwnerInvitationMergeForEvent(db, auth, eventSlug);
    if (loaded[0]) {
      return err(loaded[0]);
    }
    const { dateTime, city, venueName, merged } = loaded[1];

    const patch: Partial<InvitationOverrides> = {
      rsvpDeadlineIso: patchInput.rsvpDeadlineIso,
      rsvpMaxTotalGuests: patchInput.rsvpMaxTotalGuests,
      rsvpButtonLabel: patchInput.rsvpButtonLabel,
    };

    const mergedPreview = deepMerge(
      merged as Record<string, unknown>,
      patch as Record<string, unknown>,
    ) as InvitationDefaults;

    const deadlineMs = Date.parse(patchInput.rsvpDeadlineIso);
    if (
      !isRsvpDeadlineWithinBuffer(
        mergedPreview.countdownEvents ?? [],
        {
          dateTimeIso: dateTime.toISOString(),
          venueName,
          city,
        },
        deadlineMs,
      )
    ) {
      return err({
        reason: 'validation-error',
        message:
          'Son başvuru tarihi, en geç etkinlikten en az 2 saat önce olmalıdır',
      });
    }

    return orpc_patchInvitationOverrides({
      eventSlug,
      patch,
    });
  })
  .callable();
