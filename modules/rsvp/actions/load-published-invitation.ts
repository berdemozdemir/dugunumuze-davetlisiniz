import { eq } from 'drizzle-orm';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import {
  table_eventOverrides,
  table_eventTemplates,
} from '@/modules/templates/db-tables';
import { defaultInvitationTemplateDefaults } from '@/modules/templates/constants/default-invitation';
import type {
  InvitationDefaults,
  InvitationOverrides,
} from '@/modules/templates/types';
import { deepMerge } from '@/modules/templates/utils/merge';
import type { PublishedInvitationEventRow } from '@/modules/rsvp/types';
import { procedure_public } from '@/integrations/orpc/procedure';
import z from 'zod';

/**
 * Slug ile yayınlanmış davetiyeyi yükler: `events` satırı + şablon birleşimi.
 * Yayında değilse `not-published` hatası döner.
 */
export const orpc_loadPublishedInvitationBySlug = procedure_public
  .input(z.object({ slug: z.string().min(1) }))
  .handler(async ({ input, context: { db } }) => {
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
        .where(eq(table_events.slug, input.slug))
        .limit(1),
    );

    if (rowErr)
      return err({ reason: 'database-error', message: rowErr.message });

    if (!eventRows[0])
      return err({ reason: 'not-found', message: 'Davetiye bulunamadı' });

    if (!eventRows[0].publishedAt)
      return err({
        reason: 'not-published',
        message: 'Davetiye yayında değil',
      });

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
        .where(eq(table_eventOverrides.eventId, eventRows[0].id))
        .limit(1),
    );

    if (overrideErr)
      return err({ reason: 'database-error', message: overrideErr.message });

    const row = overrideRows[0];
    const defaultsFromDb =
      (row?.templateDefaults as InvitationDefaults | undefined) ??
      defaultInvitationTemplateDefaults;
    const overridesFromDb =
      (row?.overridesJson as InvitationOverrides | undefined) ?? {};
    const merged = deepMerge(defaultsFromDb, overridesFromDb);

    const eventRow: PublishedInvitationEventRow = {
      id: eventRows[0].id,
      slug: eventRows[0].slug,
      partner1Name: eventRows[0].primaryName,
      partner2Name: eventRows[0].secondaryName ?? undefined,
      dateTime: eventRows[0].dateTime,
      city: eventRows[0].city,
      venueName: eventRows[0].venueName,
      addressText: eventRows[0].addressText,
      publishedAt: eventRows[0].publishedAt,
    };

    return ok({ event: eventRow, merged });
  })
  .callable();
