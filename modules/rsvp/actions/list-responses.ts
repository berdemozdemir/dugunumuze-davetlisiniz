import { and, desc, eq } from 'drizzle-orm';
import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { table_rsvpResponses } from '@/modules/rsvp/db-tables';
import z from 'zod';

export const orpc_rsvp_listResponses = procedure_protected
  .input(z.object({ eventSlug: z.string().min(1) }))
  .handler(async ({ input, context: { db, auth } }) => {
    const [evErr, evRows] = await tryCatchDb(() =>
      db
        .select({ id: table_events.id })
        .from(table_events)
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );
    if (evErr) {
      return err({ reason: 'database-error', message: evErr.message });
    }

    if (!evRows[0]) {
      return err({ reason: 'not-found', message: 'Etkinlik bulunamadı' });
    }

    const [listErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_rsvpResponses.id,
          primaryFullName: table_rsvpResponses.primaryFullName,
          primaryPhone: table_rsvpResponses.primaryPhone,
          companionsJson: table_rsvpResponses.companionsJson,
          note: table_rsvpResponses.note,
          partySize: table_rsvpResponses.partySize,
          finalEventTitle: table_rsvpResponses.finalEventTitle,
          finalEventAt: table_rsvpResponses.finalEventAt,
          createdAt: table_rsvpResponses.createdAt,
        })
        .from(table_rsvpResponses)
        .where(eq(table_rsvpResponses.eventId, evRows[0].id))
        .orderBy(desc(table_rsvpResponses.createdAt)),
    );
    if (listErr) {
      return err({ reason: 'database-error', message: listErr.message });
    }

    return ok({
      responses: rows.map((r) => ({
        ...r,
        finalEventAt: r.finalEventAt?.toISOString() ?? undefined,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  })
  .callable();
