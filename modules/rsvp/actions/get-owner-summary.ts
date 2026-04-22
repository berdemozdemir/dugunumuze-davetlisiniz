import { and, eq, sum } from 'drizzle-orm';
import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { bindDefaultTemplateToEvent } from '@/modules/templates/actions/bind-default-template-to-event';
import {
  table_eventOverrides,
  table_eventTemplates,
} from '@/modules/templates/db-tables';
import { defaultInvitationTemplateDefaults } from '@/modules/templates/constants/default-invitation';
import type {
  InvitationDefaults,
  InvitationOverrides,
} from '@/modules/templates/types';
import { deepMerge } from '@/modules/templates/utils/merge';
import { RSVP_FINAL_EVENT_BUFFER_MS } from '@/modules/rsvp/constants';
import { table_rsvpResponses } from '@/modules/rsvp/db-tables';
import { resolveFinalEventForRezervation } from '@/modules/rsvp/utils/resolve-final-event';
import z from 'zod';

export const orpc_rsvp_getOwnerSummary = procedure_protected
  .input(z.object({ eventSlug: z.string().min(1) }))
  .handler(async ({ input, context: { db, auth } }) => {
    const [evErr, evRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
          dateTime: table_events.dateTime,
          city: table_events.city,
          venueName: table_events.venueName,
        })
        .from(table_events)
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );
    if (evErr) {
      return err({ reason: 'database-error', message: evErr.message });
    }
    const ev = evRows[0];
    if (!ev) {
      return err({ reason: 'not-found', message: 'Etkinlik bulunamadı' });
    }

    const bindResult = await bindDefaultTemplateToEvent(db, ev.id);
    if (bindResult[0]) {
      const e = bindResult[0];
      return err({
        reason: 'template-bind-failed',
        message:
          typeof e === 'object' &&
          e !== null &&
          'message' in e &&
          typeof (e as { message?: string }).message === 'string'
            ? (e as { message: string }).message
            : 'Şablon bağlanamadı',
      });
    }

    const [settingsErr, settingsRows] = await tryCatchDb(() =>
      db
        .select({
          templateDefaults: table_eventTemplates.defaultsJson,
          overridesJson: table_eventOverrides.overridesJson,
        })
        .from(table_eventOverrides)
        .innerJoin(
          table_eventTemplates,
          eq(table_eventTemplates.id, table_eventOverrides.templateId),
        )
        .where(eq(table_eventOverrides.eventId, ev.id))
        .limit(1),
    );
    if (settingsErr) {
      return err({ reason: 'database-error', message: settingsErr.message });
    }
    const row = settingsRows[0];
    if (!row) {
      return err({
        reason: 'not-found',
        message: 'Davetiye ayarları bulunamadı',
      });
    }

    const defaultsFromDb =
      (row.templateDefaults as InvitationDefaults | undefined) ??
      defaultInvitationTemplateDefaults;
    const overridesFromDb =
      (row.overridesJson as InvitationOverrides | undefined) ?? {};
    const merged = deepMerge(defaultsFromDb, overridesFromDb);

    const [agg] = await db
      .select({
        total: sum(table_rsvpResponses.partySize),
      })
      .from(table_rsvpResponses)
      .where(eq(table_rsvpResponses.eventId, ev.id));

    const reservedTotal = Number(agg?.total ?? 0);

    const final = resolveFinalEventForRezervation(merged.countdownEvents, {
      dateTimeIso: ev.dateTime.toISOString(),
      venueName: ev.venueName,
      city: ev.city,
    });

    const deadlineMaxIso = new Date(
      final.dateTime.getTime() - RSVP_FINAL_EVENT_BUFFER_MS,
    ).toISOString();

    return ok({
      rsvpDeadlineIso: merged.rezervationDeadlineIso ?? '',
      rsvpMaxTotalGuests: merged.rezervationMaxTotalGuests ?? null,
      rsvpButtonLabel: merged.rezervationButtonLabel ?? '',
      reservedTotal,
      deadlineMaxIso,
      finalEventTitle: final.title,
      finalEventIso: final.dateTime.toISOString(),
    });
  })
  .callable();
