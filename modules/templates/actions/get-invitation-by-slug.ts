import { procedure_public } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '@/modules/weddings/db-tables';
import { table_weddingOverrides, table_weddingTemplates } from '../db-tables';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { deepMerge } from '../utils/merge';
import type { InvitationDefaults, InvitationOverrides } from '../types';
import { defaultInvitationTemplateDefaults } from '../constants/default-invitation';

export const orpc_getInvitationBySlug = procedure_public
  .input(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db } }) => {
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
        .where(eq(table_weddings.slug, input.slug))
        .limit(1),
    );

    if (weddingErr) {
      return err({ reason: 'database-error', message: weddingErr.message });
    }

    const wedding = weddingRows[0];
    if (!wedding) {
      return err({ reason: 'not-found', message: 'Invitation not found' });
    }

    if (!wedding.publishedAt) {
      return err({
        reason: 'not-published',
        message: 'Invitation is not published',
      });
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
        publishedAt: wedding.publishedAt.toISOString(),
        template: mergedTemplate,
      },
    });
  })
  .callable();
