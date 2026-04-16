import { err, ok, tryCatchDb } from '@/lib/result';
import type { DbClient } from '@/integrations/drizzle/db-type';
import { eq } from 'drizzle-orm';
import { DEFAULT_WEDDING_TEMPLATE_KEY } from '../constants/default-invitation';
import { table_weddingOverrides, table_weddingTemplates } from '../db-tables';
import type { InvitationOverrides } from '../types';

const emptyOverrides: InvitationOverrides = {};

/**
 * Düğün oluşturulunca varsayılan şablonu bağlar. Zaten `wedding_overrides`
 * satırı varsa tekrar eklemez.
 */
export async function bindDefaultTemplateToWedding(
  dbClient: DbClient,
  weddingId: string,
) {
  const [existingErr, existingRows] = await tryCatchDb(() =>
    dbClient
      .select({ weddingId: table_weddingOverrides.weddingId })
      .from(table_weddingOverrides)
      .where(eq(table_weddingOverrides.weddingId, weddingId))
      .limit(1),
  );

  if (existingErr) {
    return err(existingErr);
  }

  if (existingRows.length > 0) {
    return ok(undefined);
  }

  const [templateErr, templateRows] = await tryCatchDb(() =>
    dbClient
      .select({ id: table_weddingTemplates.id })
      .from(table_weddingTemplates)
      .where(eq(table_weddingTemplates.key, DEFAULT_WEDDING_TEMPLATE_KEY))
      .limit(1),
  );

  if (templateErr) {
    return err(templateErr);
  }

  const templateId = templateRows[0]?.id;
  if (!templateId) {
    return err({
      reason: 'template-not-found',
      message: `Şablon bulunamadı: ${DEFAULT_WEDDING_TEMPLATE_KEY}`,
    });
  }

  const [insertErr] = await tryCatchDb(() =>
    dbClient.insert(table_weddingOverrides).values({
      weddingId,
      templateId,
      overridesJson: emptyOverrides,
    }),
  );

  if (insertErr) {
    return err(insertErr);
  }

  return ok(undefined);
}
