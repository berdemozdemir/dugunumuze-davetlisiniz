import z from 'zod';

export const invitationCoverFormSchema = z.object({
  heroImageUri: z.string().max(600).optional(),
  heroEyebrow: z.string().max(64).optional(),
  heroTagline: z.string().max(64).optional(),
  heroDateLine: z.string().max(120).optional(),
});

export type InvitationCoverFormSchema = z.infer<typeof invitationCoverFormSchema>;
