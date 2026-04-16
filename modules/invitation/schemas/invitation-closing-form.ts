import z from 'zod';

export const invitationClosingFormSchema = z.object({
  quote: z.string().optional(),
  closingNote: z.string().optional(),
  closingPhotoUris: z.array(z.string().max(600)).max(10).optional(),
});

export type InvitationClosingFormSchema = z.infer<
  typeof invitationClosingFormSchema
>;
