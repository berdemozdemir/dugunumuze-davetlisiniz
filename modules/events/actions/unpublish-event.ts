import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '../db-tables';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const orpc_unpublishEvent = procedure_protected
  .input(
    z.object({
      eventSlug: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const now = new Date();

    const [updateErr, updated] = await tryCatchDb(() =>
      db
        .update(table_events)
        .set({
          publishedAt: null,
          updatedAt: now,
        })
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .returning({ id: table_events.id }),
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
        message: 'Etkinlik bulunamadı',
      });
    }

    return ok({ success: true as const });
  })
  .callable();
