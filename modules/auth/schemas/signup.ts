import { z } from 'zod';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/;

export const signupFormSchema = z
  .object({
    email: z.email('Geçerli bir e-posta adresi girin'),
    fullName: z
      .string()
      .min(1, 'Adınızı ve soyadınızı girin')
      .max(100, 'Adınız ve soyadınız en fazla 100 karakter olmalıdır'),
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .refine((password) => strongPasswordRegex.test(password), {
        message:
          'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.',
      }),
    confirmPassword: z.string().min(1, 'Şifre tekrarını girin'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

export type SignupFormSchemaRequest = z.infer<typeof signupFormSchema>;
