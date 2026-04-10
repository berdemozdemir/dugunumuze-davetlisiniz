import { procedure_protected } from '@/integrations/orpc/procedure';
import z from 'zod';
import { table_weddings } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import { err, ok, tryCatchDb } from '@/lib/result';

export const orpc_getWeddingBySlug = procedure_protected
  .input(
    z.object({
      weddingSlug: z.string(),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [dbErr, rows] = await tryCatchDb(() =>
      db
        .select({
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
        .where(
          and(
            eq(table_weddings.slug, input.weddingSlug),
            eq(table_weddings.ownerId, auth.userId),
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

    const wedding = rows[0];

    if (!wedding) {
      return err({
        reason: 'not-found',
        message: 'Wedding not found',
      });
    }

    return ok({ wedding });
  })
  .callable();
