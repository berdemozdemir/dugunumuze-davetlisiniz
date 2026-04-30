import z from 'zod';
import { countdownEventSchema } from './count-down-event';

// TODO: add maks limitations for all fields for the following and similar schemas
/** Ham obje şeması — `.partial()` için (Zod, refine içeren şemada `.partial()` kullanmıyor). */
export const invitationOverridesObjectSchema = z.object({
  heroImageUri: z.string().max(600).optional(),
  heroImagePublicSrc: z.string().max(300).optional(),
  /** Kapak üst satırı; çok uzun satır kırılmasını önlemek için kısa tutulmalı. */
  heroEyebrow: z.string().max(64).optional(),
  /** Kapak tarih/saat satırı; tek satırda okunabilir kalması için sınırlı. */
  heroDateLine: z.string().max(120).optional(),
  /** Kapakta isimlerin altındaki kısa italik vurgu. */
  heroTagline: z.string().max(64).optional(),
  /** Supabase Storage paths, same bucket as hero; shown in closing carousel (max 10). */
  closingPhotoUris: z.array(z.string().max(600)).max(10).optional(),
  countdownEvent: countdownEventSchema.optional(),
  quote: z.string().optional(),
  storyHeadline: z.string().optional(),
  storySubline: z.string().optional(),
  storyImageUri: z.string().max(600).optional(),
  storyImagePublicSrc: z.string().max(300).optional(),
  closingNote: z.string().optional(),
  sections: z
    .object({
      hero: z.boolean().optional(),
      countdown: z.boolean().optional(),
      story: z.boolean().optional(),
      details: z.boolean().optional(),
      closing: z.boolean().optional(),
      musicPlayer: z.boolean().optional(),
      rezervation: z.boolean().optional(),
    })
    .optional(),
  /**
   * Supabase Storage object path (bucket: `digital-invitation-audio`).
   * Oynatırken trim için aşağıdaki saniye alanları kullanılır; dosya storage’da kesilmez.
   */
  musicTrackPath: z.string().max(600).optional(),
  /** Oynatma penceresi: başlangıç (saniye, ≥ 0). */
  musicTrimStartSec: z.number().min(0).optional(),
  /** Oynatma penceresi: bitiş (saniye). İkisi de doluysa `musicTrimEndSec > musicTrimStartSec` olmalı. */
  musicTrimEndSec: z.number().min(0).optional(),
  rezervationDeadlineIso: z
    .string()
    .min(1)
    .refine((s) => !Number.isNaN(Date.parse(s)), 'Geçerli bir tarih/saat')
    .optional(),
  /** `null` = üst sınır yok. */
  rezervationMaxTotalGuests: z
    .number()
    .int()
    .min(1)
    .max(500_000)
    .nullable()
    .optional(),
  rezervationButtonLabel: z.string().max(80).optional(),
});

export const invitationOverridesSchema = invitationOverridesObjectSchema.superRefine(
  (data, ctx) => {
    if (
      data.musicTrimStartSec !== undefined &&
      data.musicTrimEndSec !== undefined &&
      data.musicTrimEndSec <= data.musicTrimStartSec
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Bitiş süresi başlangıç süresinden büyük olmalıdır',
        path: ['musicTrimEndSec'],
      });
    }
  },
);

export type InvitationOverridesFormSchema = z.infer<
  typeof invitationOverridesSchema
>;
