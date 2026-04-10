import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const orpc_unpublishWedding = procedure_protected
  .input(
    z.object({
      weddingSlug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const now = new Date();

    const [updateErr, updated] = await tryCatchDb(() =>
      db
        .update(table_weddings)
        .set({
          publishedAt: null,
          updatedAt: now,
        })
        .where(
          and(
            eq(table_weddings.slug, input.weddingSlug),
            eq(table_weddings.ownerId, auth.userId),
          ),
        )
        .returning({ id: table_weddings.id }),
    );

    if (updateErr) {
      return err({
        reason: 'unpublish-failed',
        message: updateErr.message,
      });
    }

    if (!updated?.length) {
      return err({
        reason: 'not-found',
        message: 'Wedding not found',
      });
    }

    return ok({ success: true as const });
  })
  .callable();
