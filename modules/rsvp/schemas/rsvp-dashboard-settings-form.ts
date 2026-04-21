import z from 'zod';

export const rsvpDashboardSettingsFormSchema = z.object({
  deadlineLocal: z.string().min(1, 'Son başvuru tarihi gerekli'),
  maxGuests: z.string(),
  buttonLabel: z.string().max(80).optional(),
});

export type RsvpDashboardSettingsFormSchema = z.infer<
  typeof rsvpDashboardSettingsFormSchema
>;
