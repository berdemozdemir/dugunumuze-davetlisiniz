'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import {
  signupFormSchema,
  SignupFormSchemaRequest,
} from '@/lib/schemas/signup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/Form';
import { paths } from '@/lib/paths';
import { LoadingSpinner } from '../LoadingSpinner';
import { LabeledInput } from '../ui/LabeledInput';
import { useMutation } from '@tanstack/react-query';
import { service_auth } from '@/lib/client-queries/auth';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { useRouter } from 'next/navigation';

export const SignUpForm = () => {
  const router = useRouter();

  const signupMutation = useMutation(service_auth.mutations.signup());

  const form = useForm<SignupFormSchemaRequest>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
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
          disabled={signupMutation.isPending}
          className="w-full border"
          variant="ghost"
          type="submit"
        >
          Sign up {signupMutation.isPending ? <LoadingSpinner /> : null}
        </Button>

        {signupMutation.error && (
          <div className="text-destructive text-center">
            {signupMutation.error.message}
          </div>
        )}

        <div className="text-muted-foreground my-2 text-center text-sm">
          Already have an account? <Link href={paths.auth.login}>Login</Link>
        </div>
      </form>
    </Form>
  );
};
