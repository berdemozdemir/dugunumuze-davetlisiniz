import { procedure_public } from '@/integrations/orpc/procedure';
import { createClient } from '@/integrations/supabase/supabase-server';
import { err, ok, tryCatchDb } from '@/lib/result';
import { signupFormSchema } from '../schemas/signup';
import { table_users } from '../db-tables';

export const orpc_signup = procedure_public
  .input(signupFormSchema)
  .handler(async ({ input, context: { db } }) => {
    const supabase = await createClient();

    const result = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (result.error) {
      return err({
        reason: 'auth-error',
        message: result.error.message,
      });
    }

    const user = result.data.user;

    if (!user) {
      return err({
        reason: 'user-creation-failed',
        message: 'An error occurred while creating the user',
      });
    }

    if (user.identities?.length === 0) {
      return err({
        reason: 'user-already-exists',
        message: 'A user with this email already exists',
      });
    }

    const [insertProfileError] = await tryCatchDb(() =>
      db.insert(table_users).values({
        id: user.id,
        email: user.email ?? input.email,
        name: input.fullName,
      }),
    );

    if (insertProfileError) {
      return err({
        reason: 'profile-creation-failed',
        message: insertProfileError.message,
      });
    }

    return ok({
      userId: user.id,
      email: user.email,
      message: 'Sign up successful',
    });
  });
