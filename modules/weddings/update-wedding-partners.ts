import { err, ok, tryCatchDb } from '@/lib/result';
import { table_weddings } from '@/modules/weddings/db-tables';
import { and, eq } from 'drizzle-orm';
import { procedure_protected } from '@/integrations/orpc/procedure';
import { z } from 'zod';

export const orpc_updateWeddingPartnerNames = procedure_protected
  .input(
    z.object({
      weddingSlug: z.string().min(1),
      partner1Name: z.string().min(1),
      partner2Name: z.string().min(1),
    }),
  )
  .handler(async ({ input, context: { db, auth } }) => {
    const [updateErr] = await tryCatchDb(() =>
      db
        .update(table_weddings)
        .set({
          partner1Name: input.partner1Name,
          partner2Name: input.partner2Name,
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
