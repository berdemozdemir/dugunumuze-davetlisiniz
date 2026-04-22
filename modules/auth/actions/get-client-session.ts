import { createClient } from '@/integrations/supabase/supabase-server';
import { err, ok } from '@/lib/result';

export const getClientSession = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!data.user)
    return err({
      reason: 'user-is-not-logged-in',
      message: 'Oturum açılmamış',
    });

  if (error !== null) {
    return err({
      message: error.message,
      reason: 'supabase-error',
    });
  }

  if (!data.user.email)
    return err({
      message: 'Hesapta e-posta bulunmuyor',
      reason: 'email-missing',
    });

  if (!data.user)
    return err({
      message: 'Hesapta e-posta bulunmuyor',
      reason: 'email-missing',
    });

  return ok({
    userId: data.user.id,
    userEmail: data.user.email,
    userFullName: data.user.user_metadata.name,
    userMetadata: data.user.user_metadata,
  });
};
