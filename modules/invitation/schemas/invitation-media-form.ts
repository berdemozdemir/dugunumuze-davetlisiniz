import z from 'zod';

export const invitationMediaFormSchema = z
  .object({
    musicTrackPath: z.string().max(600).optional(),
    musicTrimStartSec: z.number().min(0).optional(),
    musicTrimEndSec: z.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.musicTrimStartSec !== undefined &&
      data.musicTrimEndSec !== undefined &&
      data.musicTrimEndSec <= data.musicTrimStartSec
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Bitiş süresi başlangıçtan büyük olmalı',
        path: ['musicTrimEndSec'],
      });
    }
  });

export type InvitationMediaFormSchema = z.infer<
  typeof invitationMediaFormSchema
>;
