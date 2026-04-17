import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '../db-tables';
import { desc, eq } from 'drizzle-orm';

export const orpc_weddings_listMine = procedure_protected.handler(
  async ({ context: { db, auth } }) => {
    const [dbErr, weddings] = await tryCatchDb(() =>
      db
        .select({
          id: table_weddings.id,
          slug: table_weddings.slug,
          partner1Name: table_weddings.partner1Name,
          partner2Name: table_weddings.partner2Name,
          dateTime: table_weddings.dateTime,
          publishedAt: table_weddings.publishedAt,
          createdAt: table_weddings.createdAt,
        })
        .from(table_weddings)
        .where(eq(table_weddings.ownerId, auth.userId))
        .orderBy(desc(table_weddings.createdAt)),
    );

    if (dbErr) {
      return err({
        reason: 'database-error',
        message: dbErr.message,
      });
    }

    return ok({ weddings });
  },
).callable();
