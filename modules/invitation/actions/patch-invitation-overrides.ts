import { procedure_protected } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { table_events } from '@/modules/events/db-tables';
import { bindDefaultTemplateToEvent } from '@/modules/templates/actions/bind-default-template-to-event';
import { table_eventOverrides } from '@/modules/templates/db-tables';
import {
  invitationOverridesObjectSchema,
  invitationOverridesSchema,
} from '@/modules/templates/schemas/invitation-overrides';
import type { InvitationOverrides } from '@/modules/templates/types';
import { deepMerge } from '@/modules/templates/utils/merge';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

/**
 * `overridesJson` için kısmi güncelleme: oku → patch ile birleştir → doğrula → yaz.
 * Tüm alan-spesifik korunan endpoint’ler bu birleşik JSON’u paylaşır.
 */
export const patchInvitationOverridesInputSchema = z.object({
  eventSlug: z.string().min(1),
  patch: invitationOverridesObjectSchema.partial(),
});

export const orpc_patchInvitationOverrides = procedure_protected
  .input(patchInvitationOverridesInputSchema)
  .handler(async ({ input, context: { db, auth } }) => {
    const { eventSlug, patch } = input;

    const [wErr, eventRows] = await tryCatchDb(() =>
      db
        .select({ id: table_events.id })
        .from(table_events)
        .where(
          and(
            eq(table_events.slug, eventSlug),
            eq(table_events.ownerId, auth.userId),
          ),
        )
        .limit(1),
    );
    if (wErr) return err({ reason: 'database-error', message: wErr.message });

    const eventId = eventRows[0]?.id;
    if (!eventId)
      return err({ reason: 'not-found', message: 'Event not found' });

    const [bindErr] = await bindDefaultTemplateToEvent(db, eventId);
    if (bindErr)
      return err({
        reason: 'template-bind-failed',
        message: bindErr.message ?? 'Şablon bağlanamadı',
      });

    const [readErr, overrideRows] = await tryCatchDb(() =>
      db
        .select({ overridesJson: table_eventOverrides.overridesJson })
        .from(table_eventOverrides)
        .where(eq(table_eventOverrides.eventId, eventId))
        .limit(1),
    );
    if (readErr)
      return err({ reason: 'database-error', message: readErr.message });

    const current = (overrideRows[0]?.overridesJson as InvitationOverrides) ?? {};
    const merged = deepMerge(current, patch as Partial<InvitationOverrides>);

    const parsed = invitationOverridesSchema.safeParse(merged);
    if (!parsed.success)
      return err({ reason: 'validation-error', message: parsed.error.message });

    const [updateErr] = await tryCatchDb(() =>
      db
        .update(table_eventOverrides)
        .set({
          overridesJson: parsed.data,
          updatedAt: new Date(),
        })
        .where(eq(table_eventOverrides.eventId, eventId)),
    );
    if (updateErr)
      return err({ reason: 'database-error', message: updateErr.message });

    return ok(undefined);
  })
  .callable();
