import z from 'zod';

/**
 * Kapak sayfası — çift isimleri + şablon üstü yazma alanları tek formda.
 * Sunucu: önce `weddings` isimleri, sonra davetiye override JSON (hero alanları).
 */
export const invitationCoverFormSchema = z.object({
  partner1Name: z.string().min(1, 'İsim gerekli'),
  partner2Name: z.string().min(1, 'İsim gerekli'),
  heroImageUri: z.string().max(600).optional(),
  heroEyebrow: z.string().max(64).optional(),
  heroTagline: z.string().max(64).optional(),
  heroDateLine: z.string().max(120).optional(),
});

export type InvitationCoverFormSchema = z.infer<typeof invitationCoverFormSchema>;
