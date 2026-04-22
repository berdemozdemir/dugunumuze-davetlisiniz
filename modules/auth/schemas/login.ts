import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export type LoginFormSchemaRequest = z.infer<typeof loginFormSchema>;
