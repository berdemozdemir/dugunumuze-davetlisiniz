import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { bindDefaultTemplateToEvent } from './bind-default-template-to-event';
import { table_eventOverrides, table_eventTemplates } from '../db-tables';
import type { InvitationDefaults, InvitationOverrides } from '../types';
import { deepMerge } from '../utils/merge';

export const orpc_templates_getEventInvitationSettings = procedure_protected
  .input(
    z.object({
      eventSlug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [eventErr, eventRows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
        })
        .from(table_events)
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );

    if (eventErr) {
      return err({ reason: 'database-error', message: eventErr.message });
    }

    const event = eventRows[0];
    if (!event) {
      return err({ reason: 'not-found', message: 'Event not found' });
    }

    const [bindErr] = await bindDefaultTemplateToEvent(db, event.id);
    if (bindErr) {
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });
    }

    const [settingsErr, settingsRows] = await tryCatchDb(() =>
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
      eventId: event.id,
      defaults,
      overrides,
      merged,
    });
  })
  .callable();
