import z from 'zod';

// TODO: add maks limitations for all fields for the following and similar schemas
export const invitationOverridesSchema = z.object({
  heroImageUri: z.string().max(600).optional(),
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
