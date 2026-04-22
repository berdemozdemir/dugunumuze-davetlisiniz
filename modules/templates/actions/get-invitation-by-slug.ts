import { procedure_public } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { table_eventOverrides, table_eventTemplates } from '../db-tables';
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
    const [rowErr, eventRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
          slug: table_events.slug,
          partner1Name: table_events.partner1Name,
          partner2Name: table_events.partner2Name,
          dateTime: table_events.dateTime,
          city: table_events.city,
          venueName: table_events.venueName,
          addressText: table_events.addressText,
          publishedAt: table_events.publishedAt,
        })
        .from(table_events)
        .where(eq(table_events.slug, input.slug))
        .limit(1),
    );

    if (rowErr) {
      return err({ reason: 'database-error', message: rowErr.message });
    }

    const event = eventRows[0];
    if (!event) {
      return err({ reason: 'not-found', message: 'Davetiye bulunamadı' });
    }

    if (!event.publishedAt) {
      return err({
        reason: 'not-published',
        message: 'Davetiye yayında değil',
      });
    }

    const [overrideErr, overrideRows] = await tryCatchDb(() =>
      db
        .select({
          templateDefaults: table_eventTemplates.defaultsJson,
          overridesJson: table_eventOverrides.overridesJson,
        })
        .from(table_eventOverrides)
        .innerJoin(
          table_eventTemplates,
          eq(table_eventTemplates.id, table_eventOverrides.templateId),
        )
        .where(eq(table_eventOverrides.eventId, event.id))
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
        slug: event.slug,
        partner1Name: event.partner1Name,
        partner2Name: event.partner2Name,
        dateTime: event.dateTime.toISOString(),
        city: event.city,
        venueName: event.venueName ?? undefined,
        addressText: event.addressText,
        publishedAt: event.publishedAt.toISOString(),
        template: mergedTemplate,
      },
    });
  })
  .callable();
