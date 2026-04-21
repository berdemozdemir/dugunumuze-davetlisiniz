import { eq, sum } from 'drizzle-orm';
import z from 'zod';
import { procedure_public } from '@/integrations/orpc/procedure';
import { ok } from '@/lib/result';
import { isInvitationSectionVisible } from '@/modules/invitation/section-visibility';
import { RSVP_FINAL_EVENT_BUFFER_MS } from '@/modules/rsvp/constants';
import { table_rsvpResponses } from '@/modules/rsvp/db-tables';
import type { RsvpClosedReason, RsvpPublicState } from '@/modules/rsvp/types';
import { resolveFinalEventForRsvp } from '@/modules/rsvp/utils/resolve-final-event';
import type { InvitationDefaults } from '@/modules/templates/types';

export const computeRsvpPublicStateInputSchema = z.object({
  eventId: z.string().min(1),
  merged: z.custom<InvitationDefaults>(
    (v): v is InvitationDefaults => typeof v === 'object' && v !== null,
  ),
  publishedAt: z.date().nullable(),
  core: z.object({
    dateTimeIso: z.string(),
    venueName: z.string().nullable().optional(),
    city: z.string(),
  }),
});

/**
 * Yayınlanmış davetiye + şablon birleşimine göre RSVP UI durumunu üretir:
 * bölüm açık mı, son tarih / kontenjan / ayar eksikliği, toplam onaylı kişi,
 * son etkinlik bilgisi ve son başvuru üst sınırı.
 *
 * Sunucu içi çağrılar ve diğer public ORPC handler’larıyla aynı protokol (`procedure_public` + `callable`).
 */
export const orpc_computeRsvpPublicState = procedure_public
  .input(computeRsvpPublicStateInputSchema)
  .handler(async ({ input, context: { db } }) => {
    const { eventId, merged, publishedAt, core } = input;

    const sectionOn = isInvitationSectionVisible(merged.sections, 'rsvp');
    const enabled = sectionOn && publishedAt !== null;

    const final = resolveFinalEventForRsvp(merged.countdownEvents, {
      dateTimeIso: core.dateTimeIso,
      venueName: core.venueName,
      city: core.city,
    });

    const deadlineMax = new Date(
      final.dateTime.getTime() - RSVP_FINAL_EVENT_BUFFER_MS,
    );
    const deadlineMaxIso = deadlineMax.toISOString();

    const deadlineIso = merged.rsvpDeadlineIso?.trim()
      ? merged.rsvpDeadlineIso
      : null;
    const maxTotalGuests =
      merged.rsvpMaxTotalGuests !== undefined &&
      merged.rsvpMaxTotalGuests !== null &&
      Number.isFinite(merged.rsvpMaxTotalGuests)
        ? merged.rsvpMaxTotalGuests
        : null;

    const [agg] = await db
      .select({
        total: sum(table_rsvpResponses.partySize),
      })
      .from(table_rsvpResponses)
      .where(eq(table_rsvpResponses.eventId, eventId));

    const reservedTotal = Number(agg?.total ?? 0);

    const buttonLabel = merged.rsvpButtonLabel?.trim() || 'Rezervasyon yap';

    let closedReason: RsvpClosedReason | null = null;
    if (!enabled) {
      closedReason = publishedAt ? 'disabled' : 'not-published';
    } else if (!deadlineIso) {
      closedReason = 'no-deadline';
    } else {
      const now = Date.now();
      if (Date.parse(deadlineIso) < now) {
        closedReason = 'deadline';
      } else if (maxTotalGuests !== null && reservedTotal >= maxTotalGuests) {
        closedReason = 'capacity';
      }
    }

    const canSubmit =
      enabled &&
      closedReason !== 'deadline' &&
      closedReason !== 'capacity' &&
      closedReason !== 'not-published' &&
      closedReason !== 'no-deadline' &&
      closedReason !== 'disabled';

    const state: RsvpPublicState = {
      enabled: sectionOn && publishedAt !== null,
      closedReason,
      canSubmit,
      deadlineIso,
      maxTotalGuests,
      reservedTotal,
      finalEventTitle: final.title,
      finalEventIso: final.dateTime.toISOString(),
      buttonLabel,
      deadlineMaxIso,
    };

    return ok(state);
  })
  .callable();
