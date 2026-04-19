import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { table_events } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import { err, ok, tryCatchDb } from '@/lib/result';

export const orpc_getEventBySlug = procedure_protected
  .input(
    z.object({
      eventSlug: z.string(),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
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
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );

    if (dbErr) {
      return err({
        reason: 'database-error',
        message: dbErr.message,
      });
    }

    const event = rows[0];

    if (!event) {
      return err({
        reason: 'not-found',
        message: 'Event not found',
      });
    }

    return ok({ event });
  })
  .callable();
