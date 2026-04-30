import { err, ok, tryCatchDb } from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import { eq } from 'drizzle-orm';
import { table_eventOverrides } from '../db-tables';
import { table_events } from '@/modules/events/db-tables';
import type { CountdownEventConfig, InvitationOverrides } from '../types';

/**
 * Event için `event_overrides` satırını garanti eder.
 *
 * Artık "default template key" yok: template her zaman `events.template_id` üzerinden gelir.
 * `event_overrides` satırı yoksa, `events.template_id` ile boş overrides oluşturulur.
 */
export async function bindTemplateToEvent(dbClient: DbClient, eventId: string) {
  const [existingErr, existingRows] = await tryCatchDb(() =>
    dbClient
      .select({ eventId: table_eventOverrides.eventId })
      .from(table_eventOverrides)
      .where(eq(table_eventOverrides.eventId, eventId))
      .limit(1),
  );

  if (existingErr) return err(existingErr);

  if (existingRows.length > 0) return ok(undefined);

  const [eventErr, eventRows] = await tryCatchDb(() =>
    dbClient
      .select({ templateId: table_events.templateId })
      .from(table_events)
      .where(eq(table_events.id, eventId))
      .limit(1),
  );

  if (eventErr) return err(eventErr);

  const templateId = eventRows[0]?.templateId ?? null;
  if (!templateId)
    return err({
      reason: 'template-not-found',
      message: 'Etkinlik şablonu bulunamadı',
    });

  const [coreErr, coreRows] = await tryCatchDb(() =>
    dbClient
      .select({
        dateTime: table_events.dateTime,
        city: table_events.city,
        venueName: table_events.venueName,
        addressText: table_events.addressText,
      })
      .from(table_events)
      .where(eq(table_events.id, eventId))
      .limit(1),
  );
  if (coreErr) return err(coreErr);

  const core = coreRows[0] ?? null;
  if (!core)
    return err({
      reason: 'not-found',
      message: 'Etkinlik bulunamadı',
    });

  const countdownEvent: CountdownEventConfig = {
    title: 'Etkinlik',
    dateTime: core.dateTime.toISOString(),
    city: core.city,
    venueName: core.venueName?.trim() || undefined,
    addressText: core.addressText,
  };

  const [insertErr] = await tryCatchDb(() =>
    dbClient.insert(table_eventOverrides).values({
      eventId,
      templateId,
      overridesJson: { countdownEvent } satisfies InvitationOverrides,
    }),
  );

  if (insertErr) return err(insertErr);

  return ok(undefined);
}
