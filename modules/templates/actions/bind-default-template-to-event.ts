import { err, ok, tryCatchDb } from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import { eq } from 'drizzle-orm';
import { DEFAULT_EVENT_TEMPLATE_KEY } from '../constants/default-invitation';
import { table_eventOverrides, table_eventTemplates } from '../db-tables';
import { table_events } from '@/modules/events/db-tables';

// TODO: buna bir goz at, default olani baglamaya gerek var mi yoksa her zaman kullanici yeni bir taslak olustururken secer mi?
// cunku direkt template baglayan func bu
// TODO: orpc func yap ki db'yi disardan almasin

/**
 * Davet kaydı oluşturulunca varsayılan şablonu bağlar. Zaten `event_overrides`
 * satırı varsa tekrar eklemez.
 */
export async function bindDefaultTemplateToEvent(
  dbClient: DbClient,
  eventId: string,
  templateKey: string = DEFAULT_EVENT_TEMPLATE_KEY,
) {
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

  const templateIdFromEvent = eventRows[0]?.templateId ?? undefined;

  const [templateErr, templateRows] = await tryCatchDb(() =>
    dbClient
      .select({ id: table_eventTemplates.id })
      .from(table_eventTemplates)
      .where(eq(table_eventTemplates.key, templateKey))
      .limit(1),
  );

  if (templateErr) return err(templateErr);

  const templateId = templateIdFromEvent ?? templateRows[0]?.id;
  if (!templateId)
    return err({
      reason: 'template-not-found',
      message: `Şablon bulunamadı: ${templateKey}`,
    });

  const [insertErr] = await tryCatchDb(() =>
    dbClient.insert(table_eventOverrides).values({
      eventId,
      templateId,
      overridesJson: {},
    }),
  );

  if (insertErr) return err(insertErr);

  return ok(undefined);
}
