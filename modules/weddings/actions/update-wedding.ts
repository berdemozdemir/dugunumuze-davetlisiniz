import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '../db-tables';
import { updateWeddingSchema } from '../schemas/update-wedding';
import { and, eq } from 'drizzle-orm';

export const orpc_updateWedding = procedure_protected
  .input(updateWeddingSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const date = new Date(input.dateTime);

    if (Number.isNaN(date.getTime())) {
      return err({
        reason: 'invalid-date',
        message: 'Invalid date/time',
      });
    }

    const [updateErr] = await tryCatchDb(() =>
      db
        .update(table_weddings)
        .set({
          partner1Name: input.partner1Name,
          partner2Name: input.partner2Name,
          dateTime: date,
          city: input.city,
          venueName: input.venueName,
          addressText: input.addressText,
        })
        .where(
          and(
            eq(table_weddings.slug, input.weddingSlug),
            eq(table_weddings.ownerId, auth.userId),
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
