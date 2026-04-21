import z from 'zod';

export const invitationVisibilityFormSchema = z.object({
  sections: z.object({
    hero: z.boolean().optional(),
    countdown: z.boolean().optional(),
    story: z.boolean().optional(),
    details: z.boolean().optional(),
    closing: z.boolean().optional(),
    musicPlayer: z.boolean().optional(),
    rsvp: z.boolean().optional(),
  }),
});

export type InvitationVisibilityFormSchema = z.infer<
  typeof invitationVisibilityFormSchema
>;
