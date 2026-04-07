import { z } from 'zod';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/;

export const signupFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .refine((password) => strongPasswordRegex.test(password), {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one symbol.',
    }),
});

export type SignupFormSchemaRequest = z.infer<typeof signupFormSchema>;
