import { err, ok, tryCatchDb } from '@/lib/result';
import { db } from '@/integrations/drizzle/drizzle-client';
import { eq } from 'drizzle-orm';
import {
  DEFAULT_WEDDING_TEMPLATE_KEY,
  DEFAULT_WEDDING_TEMPLATE_NAME,
  defaultInvitationTemplateDefaults,
} from '../constants/default-invitation';
import { table_weddingOverrides, table_weddingTemplates } from '../db-tables';
import type { InvitationOverrides } from '../types';

type DbClient = typeof db;

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

  let templateId = templateRows[0]?.id;

  // Fresh DB'lerde default template seed edilmemiş olabilir; burada güvenli şekilde oluşturuyoruz.
  if (!templateId) {
    const [seedErr] = await tryCatchDb(() =>
      dbClient.insert(table_weddingTemplates).values({
        key: DEFAULT_WEDDING_TEMPLATE_KEY,
        name: DEFAULT_WEDDING_TEMPLATE_NAME,
        defaultsJson: defaultInvitationTemplateDefaults,
      }),
    );

    // Aynı anda birden fazla create çalışırsa unique constraint ile çakışabilir; bu durumda tekrar okuyup devam ediyoruz.
    if (seedErr) {
      const [retryErr, retryRows] = await tryCatchDb(() =>
        dbClient
          .select({ id: table_weddingTemplates.id })
          .from(table_weddingTemplates)
          .where(eq(table_weddingTemplates.key, DEFAULT_WEDDING_TEMPLATE_KEY))
          .limit(1),
      );

      if (retryErr) {
        return err(retryErr);
      }

      templateId = retryRows[0]?.id;
      if (!templateId) {
        return err({
          reason: 'template-not-found',
          message: `Şablon bulunamadı: ${DEFAULT_WEDDING_TEMPLATE_KEY}`,
        });
      }
    } else {
      const [afterInsertErr, afterInsertRows] = await tryCatchDb(() =>
        dbClient
          .select({ id: table_weddingTemplates.id })
          .from(table_weddingTemplates)
          .where(eq(table_weddingTemplates.key, DEFAULT_WEDDING_TEMPLATE_KEY))
          .limit(1),
      );

      if (afterInsertErr) {
        return err(afterInsertErr);
      }

      templateId = afterInsertRows[0]?.id;
      if (!templateId) {
        return err({
          reason: 'template-not-found',
          message: `Şablon bulunamadı: ${DEFAULT_WEDDING_TEMPLATE_KEY}`,
        });
      }
    }
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
