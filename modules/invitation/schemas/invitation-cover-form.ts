import z from 'zod';

export const invitationCoverFormSchema = z.object({
  heroImageUri: z.string().max(600).optional(),
});

export type InvitationCoverFormSchema = z.infer<typeof invitationCoverFormSchema>;
