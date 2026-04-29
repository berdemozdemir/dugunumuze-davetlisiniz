import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { and, eq } from 'drizzle-orm';
import { procedure_protected } from '@/integrations/orpc/procedure';
import { z } from 'zod';

export const orpc_updateEventPartnerNames = procedure_protected
  .input(
    z.object({
      eventSlug: z.string().min(1),
      primaryName: z.string().min(1),
      secondaryName: z.string().optional(),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [updateErr] = await tryCatchDb(() =>
      db
        .update(table_events)
        .set({
          primaryName: input.primaryName,
          secondaryName: input.secondaryName ?? undefined,
        })
        .where(
          and(
            eq(table_events.slug, input.eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        ),
    );

    if (updateErr) {
      return err({
        reason: 'update-failed',
        message: updateErr.message,
      });
    }

    return ok({ success: true });
  })
  .callable();
