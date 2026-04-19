import {
  err,
  ok,
  tryCatchDb,
  type Result,
  type StandardRpcError,
} from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import type { CountdownEventConfig } from '@/modules/templates/types';
import {
  normalizeCountdownEventsFromTemplate,
  selectPrimaryEventForEventRow,
} from '@/modules/invitation/util';
import { EVENT_LOCATION_PLACEHOLDER } from '@/modules/events/constants';
import { table_events } from '@/modules/events/db-tables';
import { and, eq } from 'drizzle-orm';

/**
 * Etkinlik listesi kaydedildiğinde `events` çekirdek tarih/konum alanlarını
 * günceller (kapak varsayılan tarih satırı, footer yılı vb. ile uyum için).
 * Kaynak: doğrulanmış etkinlikler içinde takvimde en erken olan satır.
 */
export async function syncEventRowFromCountdownEvents(input: {
  db: DbClient;
  auth: { userId: string };
  eventSlug: string;
  countdownEvents: CountdownEventConfig[] | undefined;
}): Promise<Result<void, StandardRpcError>> {
  const { db, auth, eventSlug, countdownEvents } = input;

  const normalized = normalizeCountdownEventsFromTemplate(countdownEvents);
  if (normalized.length === 0) {
    return ok(undefined);
  }

  const primary = selectPrimaryEventForEventRow(normalized);
  if (!primary) {
    return ok(undefined);
  }

  const date = new Date(primary.dateTime);
  if (Number.isNaN(date.getTime())) {
    return err({ reason: 'validation-error', message: 'Invalid event date' });
  }

  const city = primary.city?.trim() || EVENT_LOCATION_PLACEHOLDER;
  const addressText =
    primary.addressText?.trim() || EVENT_LOCATION_PLACEHOLDER;
  const venueName = primary.venueName?.trim() || null;

  const [updateErr] = await tryCatchDb(() =>
    db
      .update(table_events)
      .set({
        dateTime: date,
        city,
        addressText,
        venueName,
      })
      .where(
        and(
          eq(table_events.slug, eventSlug),
          eq(table_events.ownerId, auth.userId),
        ),
      ),
  );

  if (updateErr) {
    return err({ reason: 'database-error', message: updateErr.message });
  }

  return ok(undefined);
}
