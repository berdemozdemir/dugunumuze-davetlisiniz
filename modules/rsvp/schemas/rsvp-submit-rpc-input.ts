import z from 'zod';
import { rsvpSubmitFormSchema } from '@/modules/rsvp/schemas/rsvp-submit-form';

/** `orpc_rsvp_submit` tam girdisi: slug + form alanları. */
export const rsvpSubmitRpcInputSchema = rsvpSubmitFormSchema.extend({
  slug: z.string().min(1),
});

export type RsvpSubmitRpcInput = z.infer<typeof rsvpSubmitRpcInputSchema>;
