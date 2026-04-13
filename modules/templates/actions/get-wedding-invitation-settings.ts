import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '@/modules/weddings/db-tables';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { bindDefaultTemplateToWedding } from './bind-default-template-to-wedding';
import { table_weddingOverrides, table_weddingTemplates } from '../db-tables';
import type { InvitationDefaults, InvitationOverrides } from '../types';
import { deepMerge } from '../utils/merge';

export const orpc_templates_getWeddingInvitationSettings = procedure_protected
  .input(
    z.object({
      weddingSlug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [weddingErr, weddingRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_weddings.id,
        })
        .from(table_weddings)
        .where(
          and(
            eq(table_weddings.slug, input.weddingSlug),
            eq(table_weddings.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );

    if (weddingErr) {
      return err({ reason: 'database-error', message: weddingErr.message });
    }

    const wedding = weddingRows[0];
    if (!wedding) {
      return err({ reason: 'not-found', message: 'Wedding not found' });
    }

    const [bindErr] = await bindDefaultTemplateToWedding(db, wedding.id);
    if (bindErr) {
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });
    }

    const [settingsErr, settingsRows] = await tryCatchDb(() =>
      db
        .select({
          templateDefaults: table_weddingTemplates.defaultsJson,
          overridesJson: table_weddingOverrides.overridesJson,
        })
        .from(table_weddingOverrides)
        .innerJoin(
          table_weddingTemplates,
          eq(table_weddingTemplates.id, table_weddingOverrides.templateId),
        )
        .where(eq(table_weddingOverrides.weddingId, wedding.id))
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

    const defaults = row.templateDefaults as InvitationDefaults;
    const overrides = row.overridesJson as InvitationOverrides;
    const merged = deepMerge(defaults ?? {}, overrides ?? {});

    return ok({
      weddingId: wedding.id,
      defaults,
      overrides,
      merged,
    });
  })
  .callable();

