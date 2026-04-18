import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { WEDDING_LOCATION_PLACEHOLDER } from '@/modules/weddings/constants';
import { createWeddingSchema } from '../schemas/create-wedding';
import { table_weddings } from '../db-tables';
import { SlugHelper } from '@/lib/utils';
import { bindDefaultTemplateToWedding } from '@/modules/templates/actions/bind-default-template-to-wedding';

export const orpc_weddings_create = procedure_protected
  .input(createWeddingSchema)
  .handler(async ({ input, context: { db, auth } }) => {
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
          /** Etkinlik eklenene kadar kapak/footera referans; sonra senkron güncellenir. */
          dateTime: new Date(),
          city: WEDDING_LOCATION_PLACEHOLDER,
          venueName: null,
          addressText: WEDDING_LOCATION_PLACEHOLDER,
        })
        .returning({ id: table_weddings.id }),
    );

    if (insertErr || !inserted?.length) {
      return err({
        reason: 'create-failed',
        message: insertErr?.message ?? 'Failed to create wedding',
      });
    }

    // TODO: merge all db operations into a single transaction in this file
    const [bindErr] = await bindDefaultTemplateToWedding(db, inserted[0].id);

    if (bindErr) {
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });
    }

    return ok({ slug });
  })
  .callable();
