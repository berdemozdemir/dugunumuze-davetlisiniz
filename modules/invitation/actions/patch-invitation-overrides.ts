import {
  err,
  ok,
  tryCatchDb,
  type Result,
  type StandardRpcError,
} from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import { table_weddings } from '@/modules/weddings/db-tables';
import { and, eq } from 'drizzle-orm';
import { bindDefaultTemplateToWedding } from '@/modules/templates/actions/bind-default-template-to-wedding';
import { table_weddingOverrides } from '@/modules/templates/db-tables';
import { invitationOverridesSchema } from '@/modules/templates/schemas/invitation-overrides';
import type { InvitationOverrides } from '@/modules/templates/types';
import { deepMerge } from '@/modules/templates/utils/merge';

/**
 * `overridesJson` için kısmi güncelleme: oku → patch ile birleştir → doğrula → yaz.
 * Ayrı bir katman olarak durur çünkü tüm alan-spesifik endpoint’ler aynı birleşik JSON’u paylaşır;
 * her action yalnızca kendi alanlarını patch eder, böylece tek bir doğrulama ve tutarlı kayıt yolu kalır.
 */
export async function patchInvitationOverrides(input: {
  db: DbClient;
  auth: { userId: string };
  weddingSlug: string;
  patch: Partial<InvitationOverrides>;
}): Promise<Result<void, StandardRpcError>> {
  const { db, auth, weddingSlug, patch } = input;

  const [wErr, weddingRows] = await tryCatchDb(() =>
    db
      .select({ id: table_weddings.id })
      .from(table_weddings)
      .where(
        and(
          eq(table_weddings.slug, weddingSlug),
          eq(table_weddings.ownerId, auth.userId),
        ),
      )
      .limit(1),
  );
  if (wErr) {
    return err({ reason: 'database-error', message: wErr.message });
  }
  const weddingId = weddingRows[0]?.id;
  if (!weddingId) {
    return err({ reason: 'not-found', message: 'Wedding not found' });
  }

  const [bindErr] = await bindDefaultTemplateToWedding(db, weddingId);
  if (bindErr) {
    return err({
      reason: 'template-bind-failed',
      message:
        typeof bindErr === 'object' &&
        bindErr !== null &&
        'message' in bindErr &&
        typeof (bindErr as { message?: string }).message === 'string'
          ? (bindErr as { message: string }).message
          : 'Şablon bağlanamadı',
    });
  }

  const [readErr, overrideRows] = await tryCatchDb(() =>
    db
      .select({ overridesJson: table_weddingOverrides.overridesJson })
      .from(table_weddingOverrides)
      .where(eq(table_weddingOverrides.weddingId, weddingId))
      .limit(1),
  );
  if (readErr) {
    return err({ reason: 'database-error', message: readErr.message });
  }

  const current = (overrideRows[0]?.overridesJson as InvitationOverrides) ?? {};
  const merged = deepMerge(
    current as Record<string, unknown>,
    patch as Record<string, unknown>,
  );

  const parsed = invitationOverridesSchema.safeParse(merged);
  if (!parsed.success) {
    return err({
      reason: 'validation-error',
      message: parsed.error.message,
    });
  }

  const now = new Date();
  const [updateErr] = await tryCatchDb(() =>
    db
      .update(table_weddingOverrides)
      .set({
        overridesJson: parsed.data,
        updatedAt: now,
      })
      .where(eq(table_weddingOverrides.weddingId, weddingId)),
  );
  if (updateErr) {
    return err({ reason: 'database-error', message: updateErr.message });
  }

  return ok(undefined);
}
