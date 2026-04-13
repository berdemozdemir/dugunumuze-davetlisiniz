import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { deepMerge } from '@/modules/templates/utils/merge';
import type {
  InvitationDefaults,
  InvitationOverrides,
} from '@/modules/templates/types';
import { defaultInvitationTemplateDefaults } from '@/modules/templates/constants/default-invitation';
import {
  table_weddingOverrides,
  table_weddingTemplates,
} from '@/modules/templates/db-tables';
import { bindDefaultTemplateToWedding } from '@/modules/templates/actions/bind-default-template-to-wedding';

export const orpc_weddings_getInvitationPreviewBySlug = procedure_protected
  .input(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [weddingErr, weddingRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_weddings.id,
          slug: table_weddings.slug,
          partner1Name: table_weddings.partner1Name,
          partner2Name: table_weddings.partner2Name,
          dateTime: table_weddings.dateTime,
          city: table_weddings.city,
          venueName: table_weddings.venueName,
          addressText: table_weddings.addressText,
          publishedAt: table_weddings.publishedAt,
        })
        .from(table_weddings)
        .where(
          and(
            eq(table_weddings.slug, input.slug),
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
      return err({ reason: 'not-found', message: 'Invitation not found' });
    }

    const [bindErr] = await bindDefaultTemplateToWedding(db, wedding.id);
    if (bindErr) {
      return err({ reason: 'template-bind-failed', message: bindErr.message });
    }

    const [overrideErr, overrideRows] = await tryCatchDb(() =>
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

    if (overrideErr) {
      return err({ reason: 'database-error', message: overrideErr.message });
    }

    const row = overrideRows[0];

    const defaultsFromDb =
      (row?.templateDefaults as InvitationDefaults | undefined) ??
      defaultInvitationTemplateDefaults;
    const overridesFromDb =
      (row?.overridesJson as InvitationOverrides | undefined) ?? {};

    const mergedTemplate = deepMerge(defaultsFromDb, overridesFromDb);

    return ok({
      invitation: {
        slug: wedding.slug,
        partner1Name: wedding.partner1Name,
        partner2Name: wedding.partner2Name,
        dateTime: wedding.dateTime.toISOString(),
        city: wedding.city,
        venueName: wedding.venueName ?? undefined,
        addressText: wedding.addressText,
        publishedAt: wedding.publishedAt?.toISOString(),
        template: mergedTemplate,
      },
    });
  })
  .callable();

