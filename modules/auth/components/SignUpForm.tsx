'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { signupFormSchema, SignupFormSchemaRequest } from '../schemas/signup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form';
import { paths } from '@/lib/paths';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AuthFormShell } from './AuthFormShell';
import { LabeledInput } from './LabeledInput';
import { useMutation } from '@tanstack/react-query';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { useRouter } from 'next/navigation';
import { service_auth } from '../client-queries';

export const SignUpForm = () => {
  const router = useRouter();

  const signupMutation = useMutation(service_auth.mutations.signup());

  const form = useForm<SignupFormSchemaRequest>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormSchemaRequest) => {
    const supabase = createSupabaseBrowserClient();

    await signupMutation.mutateAsync(data);

    await supabase.auth.refreshSession();

    toast.success('Account created. You are signed in.');

    router.push(paths.dashboard);
  };

  return (
    <Form {...form}>
      <AuthFormShell
        title="Aramıza katılın"
        subtitle="Hesap oluşturarak misafir listesi ve düğün detaylarına erişin."
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput {...field} label="E-posta" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput isPasswordField {...field} label="Şifre" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LabeledInput
                    isPasswordField
                    {...field}
                    label="Şifre tekrar"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={signupMutation.isPending}
            className="mt-1 w-full border-gold/50 bg-gold py-5 text-sm font-semibold text-deep shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:bg-gold-light hover:text-deep hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Kayıt ol {signupMutation.isPending ? <LoadingSpinner /> : null}
          </Button>

          {signupMutation.error && (
            <div className="text-destructive rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-center text-sm">
              {signupMutation.error.message}
            </div>
          )}

          <div className="border-t border-white/10 pt-5 text-center text-sm text-cream/55">
            Zaten hesabınız var mı?{' '}
            <Link
              className="font-medium text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              href={paths.auth.login}
            >
              Giriş yapın
            </Link>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
