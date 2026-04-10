import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { createWeddingSchema } from '../schemas/create-wedding';
import { table_weddings } from '../db-tables';
import { SlugHelper } from '@/lib/utils/slug';
import { bindDefaultTemplateToWedding } from '@/modules/templates/utils/bind-default-template-to-wedding';
import { eq } from 'drizzle-orm';

export const orpc_weddings_create = procedure_protected
  .input(createWeddingSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const date = new Date(input.dateTime);

    if (Number.isNaN(date.getTime())) {
      return err({
        reason: 'invalid-date',
        message: 'Invalid date/time',
      });
    }

    const [insertErr, inserted] = await tryCatchDb(() =>
      db
        .insert(table_weddings)
        .values({
          ownerId: auth.userId,
          slug: `temporary-slug-${Date.now()}`,
          partner1Name: input.partner1Name,
          partner2Name: input.partner2Name,
          dateTime: date,
          city: input.city,
          venueName: input.venueName,
          addressText: input.addressText,
        })
        .returning({ id: table_weddings.id }),
    );

    if (insertErr || !inserted?.length) {
      return err({
        reason: 'create-failed',
        message: insertErr?.message ?? 'Failed to create wedding',
      });
    }

    const weddingId = inserted[0].id;

    const slug = SlugHelper.generateUnique(
      `${input.partner1Name}-${input.partner2Name}`,
      weddingId,
    );

    const [slugUpdateErr] = await tryCatchDb(() =>
      db
        .update(table_weddings)
        .set({ slug })
        .where(eq(table_weddings.id, weddingId)),
    );

    if (slugUpdateErr) {
      return err({
        reason: 'slug-update-failed',
        message: slugUpdateErr.message,
      });
    }

    // TODO: merge all db operations into a single transaction in this file
    const [bindErr] = await bindDefaultTemplateToWedding(db, weddingId);

    if (bindErr) {
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });
    }

    return ok({ slug });
  });
