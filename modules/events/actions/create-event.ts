import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { EVENT_LOCATION_PLACEHOLDER } from '@/modules/events/constants';
import { createEventSchema } from '../schemas/create-event';
import { table_events } from '../db-tables';
import { SlugHelper } from '@/lib/utils';
import { bindDefaultTemplateToEvent } from '@/modules/templates/actions/bind-default-template-to-event';

/** Yeni davet sayfası (tek `events` satırı + varsayılan şablon). */
export const orpc_createEvent = procedure_protected
  .input(createEventSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const slug = SlugHelper.generateUnique(
      `${input.partner1Name}-${input.partner2Name}`,
      Date.now().toString(),
    );

    const [insertErr, inserted] = await tryCatchDb(() =>
      db
        .insert(table_events)
        .values({
          ownerId: auth.userId,
          slug,
          partner1Name: input.partner1Name,
          partner2Name: input.partner2Name,
          dateTime: new Date(),
          city: EVENT_LOCATION_PLACEHOLDER,
          venueName: null,
          addressText: EVENT_LOCATION_PLACEHOLDER,
        })
        .returning({ id: table_events.id }),
    );

    if (insertErr || !inserted?.length) {
      return err({
        reason: 'create-failed',
        message: insertErr?.message ?? 'Kayıt oluşturulamadı',
      });
    }

    const [bindErr] = await bindDefaultTemplateToEvent(db, inserted[0].id);

    if (bindErr) {
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });
    }

    return ok({ slug });
  })
  .callable();
