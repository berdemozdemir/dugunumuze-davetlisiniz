'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { service_auth } from '../client-queries';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { loginFormSchema, LoginFormSchemaRequest } from '../schemas/login';
import { Button } from '@/components/ui/Button';

const supabase = createSupabaseBrowserClient();

export const LoginForm = () => {
  const loginMutation = useMutation(service_auth.mutations.login());

  const form = useForm<LoginFormSchemaRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormSchemaRequest) => {
    await loginMutation.mutateAsync(data);

    await supabase.auth.refreshSession();

    toast.success('Login successful!');
  };

  return (
    <Form {...form}>
      <AuthFormShell
        title="Hoş geldiniz"
        subtitle="Hesabınıza giriş yaparak düğün planlamanıza devam edin."
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

          <Button
            disabled={loginMutation.isPending}
            className="mt-1 w-full border-gold/50 bg-gold py-5 text-sm font-semibold text-deep shadow-[0_8px_24px_-4px_rgba(212,175,55,0.35)] transition-[color,box-shadow,transform] hover:bg-gold-light hover:text-deep hover:shadow-[0_10px_28px_-4px_rgba(212,175,55,0.45)] active:translate-y-px"
            type="submit"
          >
            Giriş yap {loginMutation.isPending ? <LoadingSpinner /> : null}
          </Button>

          {loginMutation.error && (
            <div className="text-destructive rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-center text-sm">
              {loginMutation.error.message}
            </div>
          )}

          <div className="border-t border-white/10 pt-5 text-center text-sm text-cream/55">
            Hesabınız yok mu?{' '}
            <Link
              className="font-medium text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              href={paths.auth.signup}
            >
              Kayıt olun
            </Link>
          </div>
        </form>
      </AuthFormShell>
    </Form>
  );
};
