import z from 'zod';

export const invitationOverridesSchema = z.object({
  quote: z.string().optional(),
  shortNote: z.string().optional(),
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
