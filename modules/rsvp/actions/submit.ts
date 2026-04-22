import { procedure_public } from '@/integrations/orpc/procedure';
import { err, ok, tryCatchDb } from '@/lib/result';
import { isInvitationSectionVisible } from '@/modules/invitation/section-visibility';
import { RSVP_MAX_COMPANIONS } from '@/modules/rsvp/constants';
import { table_rsvpResponses } from '@/modules/rsvp/db-tables';
import { orpc_computeRsvpPublicState } from '@/modules/rsvp/actions/compute-public-state';
import { rsvpSubmitRpcInputSchema } from '@/modules/rsvp/schemas/rsvp-submit-rpc-input';
import type { RsvpCompanionStored } from '@/modules/rsvp/types';
import { normalizeTrPhone } from '@/modules/rsvp/utils/phone';
import { resolveFinalEventForRezervation } from '@/modules/rsvp/utils/resolve-final-event';
import { and, eq } from 'drizzle-orm';
import { orpc_loadPublishedInvitationBySlug } from './load-published-invitation';

// TODO: butun bu rsvp actionlarini refactor et gozden gecir
export const orpc_rsvp_submit = procedure_public
  .input(rsvpSubmitRpcInputSchema)
  .handler(async ({ input, context: { db } }) => {
    const { slug, primaryFullName, primaryPhone, companions, note } = input;

    const loaded = await orpc_loadPublishedInvitationBySlug({ slug });
    if (loaded[0]) {
      return err(loaded[0]);
    }
    const { event, merged } = loaded[1]!;

    if (!isInvitationSectionVisible(merged.sections, 'rezervation')) {
      return err({
        reason: 'rezervation-disabled',
        message: 'Rezervasyon bu davetiyede kapalı',
      });
    }

    if (!merged.rezervationDeadlineIso?.trim()) {
      return err({
        reason: 'rezervation-not-configured',
        message: 'Rezervasyon henüz yapılandırılmamış',
      });
    }

    const computed = await orpc_computeRsvpPublicState({
      eventId: event.id,
      merged,
      publishedAt: event.publishedAt,
      core: {
        dateTimeIso: event.dateTime.toISOString(),
        venueName: event.venueName,
        city: event.city,
      },
    });
    if (computed[0]) {
      return err(computed[0]);
    }
    const publicState = computed[1]!;

    if (!publicState.canSubmit) {
      if (publicState.closedReason === 'deadline') {
        return err({
          reason: 'deadline-passed',
          message: 'Son başvuru tarihi geçti',
        });
      }
      if (publicState.closedReason === 'capacity') {
        return err({
          reason: 'capacity-full',
          message: 'Kontenjan doldu',
        });
      }
      return err({
        reason: 'rsvp-closed',
        message: 'Rezervasyon alınamıyor',
      });
    }

    const primaryPhoneNorm = normalizeTrPhone(primaryPhone);
    if (!primaryPhoneNorm) {
      return err({
        reason: 'validation-error',
        message: 'Geçerli bir cep telefonu girin',
      });
    }

    const companionsStored: RsvpCompanionStored[] = [];
    for (const c of companions) {
      const phoneRaw = c.phone?.trim();
      let phoneNorm: string | null = null;
      if (phoneRaw) {
        phoneNorm = normalizeTrPhone(phoneRaw);
        if (!phoneNorm) {
          return err({
            reason: 'validation-error',
            message: `Geçersiz telefon: ${c.fullName}`,
          });
        }
      }
      companionsStored.push({
        fullName: c.fullName.trim(),
        phone: phoneNorm,
      });
    }

    const partySize = 1 + companionsStored.length;

    if (partySize > 1 + RSVP_MAX_COMPANIONS) {
      return err({
        reason: 'too-many-companions',
        message: 'Yanınızda en fazla 20 kişi getirebiliyorsunuz',
      });
    }

    if (
      publicState.maxTotalGuests !== null &&
      publicState.reservedTotal + partySize > publicState.maxTotalGuests
    ) {
      return err({
        reason: 'capacity-full',
        message: 'Kontenjan bu grup için yeterli değil',
      });
    }

    const final = resolveFinalEventForRezervation(merged.countdownEvents, {
      dateTimeIso: event.dateTime.toISOString(),
      venueName: event.venueName,
      city: event.city,
    });

    const [dupErr, dupRows] = await tryCatchDb(() =>
      db
        .select({ id: table_rsvpResponses.id })
        .from(table_rsvpResponses)
        .where(
          and(
            eq(table_rsvpResponses.eventId, event.id),
            eq(table_rsvpResponses.primaryPhone, primaryPhoneNorm),
          ),
        )
        .limit(1),
    );
    if (dupErr) {
      return err({ reason: 'database-error', message: dupErr.message });
    }
    if (dupRows[0]) {
      return err({
        reason: 'duplicate-phone',
        message: 'Bu telefon numarası ile zaten kayıt yapılmış',
      });
    }

    const [insertErr] = await tryCatchDb(() =>
      db.insert(table_rsvpResponses).values({
        eventId: event.id,
        primaryFullName: primaryFullName.trim(),
        primaryPhone: primaryPhoneNorm,
        companionsJson: companionsStored,
        note: note?.trim() || null,
        partySize,
        finalEventTitle: final.title,
        finalEventAt: final.dateTime,
      }),
    );

    if (insertErr) {
      const msg = insertErr.message.toLowerCase();
      if (msg.includes('unique') || msg.includes('duplicate')) {
        return err({
          reason: 'duplicate-phone',
          message: 'Bu telefon numarası ile zaten kayıt yapılmış',
        });
      }
      return err({ reason: 'database-error', message: insertErr.message });
    }

    return ok({ ok: true });
  })
  .callable();
