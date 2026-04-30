import {
  err,
  ok,
  tryCatchDb,
  type Result,
  type StandardRpcError,
} from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import type { CountdownEventConfig } from '@/modules/templates/types';
import { EVENT_LOCATION_PLACEHOLDER } from '@/modules/events/constants';
import { table_events } from '@/modules/events/db-tables';
import { and, eq } from 'drizzle-orm';

/**
 * Etkinlik listesi kaydedildiğinde `events` çekirdek tarih/konum alanlarını
 * günceller (kapak varsayılan tarih satırı, footer yılı vb. ile uyum için).
 * Kaynak: doğrulanmış etkinlikler içinde takvimde en geç olan satır (ana organizasyon).
 */
export async function syncEventRowFromCountdownEvent(input: {
  db: DbClient;
  auth: { userId: string };
  eventSlug: string;
  countdownEvent: CountdownEventConfig;
}): Promise<Result<void, StandardRpcError>> {
  const { db, auth, eventSlug, countdownEvent } = input;

  const date = new Date(countdownEvent.dateTime);
  if (Number.isNaN(date.getTime())) {
    return err({ reason: 'validation-error', message: 'Geçersiz etkinlik tarihi' });
  }

  const city = countdownEvent.city?.trim() || EVENT_LOCATION_PLACEHOLDER;
  const addressText =
    countdownEvent.addressText?.trim() || EVENT_LOCATION_PLACEHOLDER;
  const venueName = countdownEvent.venueName?.trim() || null;

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
