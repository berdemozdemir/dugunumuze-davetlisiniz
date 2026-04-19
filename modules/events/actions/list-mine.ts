import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '../db-tables';
import { desc, eq } from 'drizzle-orm';

export const orpc_events_listMine = procedure_protected.handler(
  async ({ context: { db, auth } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
          slug: table_events.slug,
          partner1Name: table_events.partner1Name,
          partner2Name: table_events.partner2Name,
          dateTime: table_events.dateTime,
          publishedAt: table_events.publishedAt,
          createdAt: table_events.createdAt,
        })
        .from(table_events)
        .where(eq(table_events.ownerId, auth.userId))
        .orderBy(desc(table_events.createdAt)),
    );

    if (dbErr) {
      return err({
        reason: 'database-error',
        message: dbErr.message,
      });
    }

    return ok({ events: rows });
  },
).callable();
