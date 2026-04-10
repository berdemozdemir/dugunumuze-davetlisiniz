import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { createWeddingSchema } from '../schemas/create-wedding';
import { table_weddings } from '../db-tables';
import { SlugHelper } from '@/lib/utils/slug';

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

    const slug = SlugHelper.generateUnique(
      `${input.partner1Name}-${input.partner2Name}`,
      Date.now().toString(),
    );

    const [insertErr, inserted] = await tryCatchDb(() =>
      db
        .insert(table_weddings)
        .values({
          ownerId: auth.userId,
          slug,
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

    return ok({ slug });
  });
