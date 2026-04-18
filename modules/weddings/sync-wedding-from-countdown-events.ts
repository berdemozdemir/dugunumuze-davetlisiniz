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
  selectPrimaryEventForWeddingRow,
} from '@/modules/invitation/util';
import { table_weddings } from '@/modules/weddings/db-tables';
import { and, eq } from 'drizzle-orm';

/** DB `notNull` kolonları için boş konumda kullanılan yer tutucu. */
const LOCATION_PLACEHOLDER = 'Belirtilmedi';

/**
 * Etkinlik listesi kaydedildiğinde `weddings` çekirdek tarih/konum alanlarını
 * günceller (kapak varsayılan tarih satırı, footer yılı vb. ile uyum için).
 * Kaynak: doğrulanmış etkinlikler içinde takvimde en erken olan satır.
 */
export async function syncWeddingRowFromCountdownEvents(input: {
  db: DbClient;
  auth: { userId: string };
  weddingSlug: string;
  countdownEvents: CountdownEventConfig[] | undefined;
}): Promise<Result<void, StandardRpcError>> {
  const { db, auth, weddingSlug, countdownEvents } = input;

  const normalized = normalizeCountdownEventsFromTemplate(countdownEvents);
  if (normalized.length === 0) {
    return ok(undefined);
  }

  const primary = selectPrimaryEventForWeddingRow(normalized);
  if (!primary) {
    return ok(undefined);
  }

  const date = new Date(primary.dateTime);
  if (Number.isNaN(date.getTime())) {
    return err({ reason: 'validation-error', message: 'Invalid event date' });
  }

  const city = primary.city?.trim() || LOCATION_PLACEHOLDER;
  const addressText = primary.addressText?.trim() || LOCATION_PLACEHOLDER;
  const venueName = primary.venueName?.trim() || null;

  const [updateErr] = await tryCatchDb(() =>
    db
      .update(table_weddings)
      .set({
        dateTime: date,
        city,
        addressText,
        venueName,
      })
      .where(
        and(
          eq(table_weddings.slug, weddingSlug),
          eq(table_weddings.ownerId, auth.userId),
        ),
      ),
  );

  if (updateErr) {
    return err({ reason: 'database-error', message: updateErr.message });
  }

  return ok(undefined);
}
