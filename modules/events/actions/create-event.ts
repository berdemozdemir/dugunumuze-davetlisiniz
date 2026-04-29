import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { createEventSchema } from '../schemas/create-event';
import { table_events } from '../db-tables';
import { SlugHelper } from '@/lib/utils';
import { bindDefaultTemplateToEvent } from '@/modules/templates/actions/bind-default-template-to-event';
import { table_eventTemplates } from '@/modules/templates/db-tables';
import { eq } from 'drizzle-orm';

/** Yeni davet sayfası (tek `events` satırı + varsayılan şablon). */
export const orpc_createEvent = procedure_protected
  .input(createEventSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    // TODO: slug icerisinde event type yazilabilir mi?
    const slug = SlugHelper.generateUnique(
      `${input.primaryName}-${input.secondaryName ?? ''}`,
      Date.now().toString(),
    );

    const dateTime = new Date(input.dateTimeIso);
    if (Number.isNaN(dateTime.getTime())) {
      return err({
        reason: 'validation-error',
        message: 'Tarih formatı geçersiz',
      });
    }

    const [templateErr, templateRows] = await tryCatchDb(() =>
      db
        .select({ id: table_eventTemplates.id })
        .from(table_eventTemplates)
        .where(eq(table_eventTemplates.key, input.templateKey))
        .limit(1),
    );

    if (templateErr)
      return err({ reason: 'database-error', message: templateErr.message });

    const templateId = templateRows[0]?.id;
    if (!templateId)
      return err({
        reason: 'template-not-found',
        message: `Şablon bulunamadı: ${input.templateKey}`,
      });

    const [insertErr, inserted] = await tryCatchDb(() =>
      db
        .insert(table_events)
        .values({
          ownerId: auth.userId,
          slug,
          templateId,
          status: 'draft',
          currentStep: 2,
          primaryName: input.primaryName,
          secondaryName: input.secondaryName ?? null,
          dateTime,
          city: input.city,
          venueName: input.venueName?.trim() || null,
          addressText: input.addressText,
        })
        .returning({ id: table_events.id }),
    );

    if (insertErr || !inserted?.length) {
      return err({
        reason: 'create-failed',
        message: insertErr?.message ?? 'Kayıt oluşturulamadı',
      });
    }

    const [bindErr] = await bindDefaultTemplateToEvent(
      db,
      inserted[0].id,
      input.templateKey,
    );

    if (bindErr)
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message,
      });

    return ok({ slug });
  })
  .callable();
