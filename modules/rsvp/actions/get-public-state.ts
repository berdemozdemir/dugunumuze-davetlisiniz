import { procedure_public } from '@/integrations/orpc/procedure';
import { err, ok } from '@/lib/result';
import { orpc_computeRsvpPublicState } from '@/modules/rsvp/actions/compute-public-state';
import { orpc_loadPublishedInvitationBySlug } from '@/modules/rsvp/actions/load-published-invitation';
import z from 'zod';

export const orpc_rsvp_getPublicState = procedure_public
  .input(z.object({ slug: z.string().min(1) }))
  .handler(async ({ input }) => {
    const loaded = await orpc_loadPublishedInvitationBySlug({
      slug: input.slug,
    });
    if (loaded[0]) {
      return err(loaded[0]);
    }
    const { event, merged } = loaded[1]!;

    const computed = await orpc_computeRsvpPublicState({
      eventId: event.id,
      merged,
      publishedAt: event.publishedAt,
      core: {
        dateTimeIso: event.dateTime.toISOString(),
        venueName: event.venueName,
        city: event.city,
      },
    });
    if (computed[0]) {
      return err(computed[0]);
    }

    return ok(computed[1]!);
  })
  .callable();
