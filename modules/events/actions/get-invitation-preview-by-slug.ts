import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { deepMerge } from '@/modules/templates/utils/merge';
import type {
  InvitationDefaults,
  InvitationOverrides,
} from '@/modules/templates/types';
import { defaultInvitationTemplateDefaults } from '@/modules/templates/constants/default-invitation';
import {
  table_eventOverrides,
  table_eventTemplates,
} from '@/modules/templates/db-tables';
import { bindTemplateToEvent } from '@/modules/templates/actions/bind-default-template-to-event';

export const orpc_events_getInvitationPreviewBySlug = procedure_protected
  .input(
    z.object({
      slug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [rowErr, eventRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
          slug: table_events.slug,
          primaryName: table_events.primaryName,
          secondaryName: table_events.secondaryName,
          dateTime: table_events.dateTime,
          city: table_events.city,
          venueName: table_events.venueName,
          addressText: table_events.addressText,
          publishedAt: table_events.publishedAt,
        })
        .from(table_events)
        .where(
          and(
            eq(table_events.slug, input.slug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );

    if (rowErr) {
      return err({ reason: 'database-error', message: rowErr.message });
    }

    const event = eventRows[0];
    if (!event) {
      return err({ reason: 'not-found', message: 'Davetiye bulunamadı' });
    }

    const [bindErr] = await bindTemplateToEvent(db, event.id);
    if (bindErr) {
      return err({ reason: 'template-bind-failed', message: bindErr.message });
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
        partner1Name: event.primaryName,
        partner2Name: event.secondaryName ?? undefined,
        dateTime: event.dateTime.toISOString(),
        city: event.city,
        venueName: event.venueName ?? undefined,
        addressText: event.addressText,
        publishedAt: event.publishedAt?.toISOString(),
        template: mergedTemplate,
      },
    });
  })
  .callable();
