import z from 'zod';

/** Hikâye bölümü başlık / alt metin (tarih düğün kaydındaki `dateTime` alanından gelir). */
export const invitationStoryTextFormSchema = z.object({
  storyHeadline: z.string().optional(),
  storySubline: z.string().optional(),
  storyImageUri: z.string().max(600).optional(),
});

export type InvitationStoryTextFormSchema = z.infer<
  typeof invitationStoryTextFormSchema
>;
