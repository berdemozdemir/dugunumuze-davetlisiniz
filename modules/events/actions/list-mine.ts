import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '../db-tables';
import { asc, eq } from 'drizzle-orm';
import { DashboardEventListItem } from '@/modules/dashboard-home/types';

export const orpc_events_listMine = procedure_protected
  .handler(async ({ context: { db, auth } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
          id: table_events.id,
          slug: table_events.slug,
          primaryName: table_events.primaryName,
          secondaryName: table_events.secondaryName,
          dateTime: table_events.dateTime,
          publishedAt: table_events.publishedAt,
          createdAt: table_events.createdAt,
        })
        .from(table_events)
        .where(eq(table_events.ownerId, auth.userId))
        .orderBy(asc(table_events.dateTime)),
    );

    if (dbErr) {
      return err({
        reason: 'database-error',
        message: dbErr.message,
      });
    }

    const events: DashboardEventListItem[] = rows.map((w) => ({
      id: w.id,
      slug: w.slug,
      primaryName: w.primaryName,
      secondaryName: w.secondaryName ?? undefined,
      dateTime: w.dateTime,
      publishedAt: w.publishedAt ?? undefined,
      createdAt: w.createdAt,
    }));

    return ok({ events });
  })
  .callable();
