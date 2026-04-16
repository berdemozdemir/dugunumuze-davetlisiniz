import z from 'zod';
import { COUNTDOWN_EVENTS_MAX } from '@/modules/invitation/constants';
import { countdownEventSchema } from './count-down-event';

// TODO: add maks limitations for all fields for the following and similar schemas
export const invitationOverridesSchema = z.object({
  heroImageUri: z.string().max(600).optional(),
  /** Supabase Storage paths, same bucket as hero; shown in closing carousel (max 10). */
  closingPhotoUris: z.array(z.string().max(600)).max(10).optional(),
  countdownEvents: z
    .array(countdownEventSchema)
    .max(COUNTDOWN_EVENTS_MAX)
    .optional(),
  quote: z.string().optional(),
  storyHeadline: z.string().optional(),
  storySubline: z.string().optional(),
  closingNote: z.string().optional(),
  sections: z
    .object({
      hero: z.boolean().optional(),
      countdown: z.boolean().optional(),
      story: z.boolean().optional(),
      details: z.boolean().optional(),
      closing: z.boolean().optional(),
      musicPlayer: z.boolean().optional(),
    })
    .optional(),
});

export type InvitationOverridesFormSchema = z.infer<
  typeof invitationOverridesSchema
>;
