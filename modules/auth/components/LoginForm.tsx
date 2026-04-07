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
      <form className="mt-4 w-80" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2 w-full">
              <FormControl>
                <LabeledInput {...field} label="Email" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2 w-full">
              <FormControl>
                <LabeledInput isPasswordField {...field} label="Password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={loginMutation.isPending}
          className="w-full border"
          variant="ghost"
          type="submit"
        >
          Login {loginMutation.isPending ? <LoadingSpinner /> : null}
        </Button>

        {loginMutation.error && (
          <div className="text-destructive text-center">
            {loginMutation.error.message}
          </div>
        )}

        <div className="text-muted-foreground my-2 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href={paths.auth.signup}>Sign Up</Link>
        </div>
      </form>
    </Form>
  );
};
