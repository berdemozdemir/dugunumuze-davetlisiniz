import { and, eq } from 'drizzle-orm';
import type { DbClient } from '@/integrations/drizzle/db-type';
import {
  err,
  ok,
  tryCatchDb,
  type Result,
  type StandardRpcError,
} from '@/lib/result';
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

/**
 * Sahibin etkinliği için şablon varsayılanları + `overridesJson` birleşimi.
 * `bindDefaultTemplateToEvent` dahil; `getEventInvitationSettings` ve RSVP ayarları aynı yolu kullanır.
 */
export async function loadOwnerInvitationMergeForEvent(
  db: DbClient,
  auth: { userId: string },
  eventSlug: string,
): Promise<
  Result<
    {
      eventId: string;
      dateTime: Date;
      city: string;
      venueName: string | null;
      defaults: InvitationDefaults;
      overrides: InvitationOverrides;
      merged: InvitationDefaults;
    },
    StandardRpcError
  >
> {
  const [eventErr, eventRows] = await tryCatchDb(() =>
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
          eq(table_events.slug, eventSlug),
          eq(table_events.ownerId, auth.userId),
        ),
      )
      .limit(1),
  );

  if (eventErr) {
    return err({ reason: 'database-error', message: eventErr.message });
  }

  const event = eventRows[0];
  if (!event) {
    return err({ reason: 'not-found', message: 'Event not found' });
  }

  const [bindErr] = await bindDefaultTemplateToEvent(db, event.id);
  if (bindErr)
    return err({
      reason: 'template-bind-failed',
      message: bindErr.message ?? 'Şablon bağlanamadı',
    });

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
      .where(eq(table_eventOverrides.eventId, event.id))
      .limit(1),
  );

  if (settingsErr) {
    return err({ reason: 'database-error', message: settingsErr.message });
  }

  const row = settingsRows[0];
  if (!row) {
    return err({
      reason: 'not-found',
      message: 'Invitation settings not found',
    });
  }

  const defaults =
    (row.templateDefaults as InvitationDefaults | undefined) ??
    defaultInvitationTemplateDefaults;
  const overrides =
    (row.overridesJson as InvitationOverrides | undefined) ?? {};
  const merged = deepMerge(defaults, overrides);

  return ok({
    eventId: event.id,
    dateTime: event.dateTime,
    city: event.city,
    venueName: event.venueName,
    defaults,
    overrides,
    merged,
  });
}
