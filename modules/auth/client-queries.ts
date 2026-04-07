import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { ArgsOf, okOrThrow } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import { createSupabaseBrowserClient } from '@/integrations/supabase/supabase-client';
import { AuthQueryResult } from './types';
import {
  queryClient,
  usePublicQuery,
} from '@/integrations/tanstack-query/query';
import { useRouter } from 'next/navigation';
import { paths } from '@/lib/paths';

const supabase = createSupabaseBrowserClient();

// TODO: add reset password
// TODO: add update password
// TODO: add update login with google

export const service_auth = {
  queries: {
    auth: () =>
      queryOptions<AuthQueryResult>({
        queryKey: orpc.auth.getAuthSession.queryOptions().queryKey,
        gcTime: 1000 * 60 * 60 * 5,
        queryFn: async () => {
          const {
            data: { session: supabaseSession },
          } = await supabase.auth.getSession();

          if (!supabaseSession) return { isLoggedIn: false };

          const [sessionErr, sessionData] =
            await orpc.auth.getAuthSession.call();

          if (sessionErr) {
            const errorReason = sessionErr.reason;

            switch (errorReason) {
              case 'supabase-error':
              case 'email-missing':
              case 'user-is-not-logged-in':
                await supabase.auth.signOut();
                return { isLoggedIn: false };
              default:
                throw new Error(errorReason);
            }
          }

          return {
            isLoggedIn: true,
            user: {
              id: sessionData.userId,
              email: sessionData.userEmail,
              metadata: supabaseSession.user?.user_metadata,
            },
          };
        },
      }),
  },

  mutations: {
    login: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.auth.login.call>) =>
          orpc.auth.login.call(args).then(okOrThrow),
        onSettled: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_auth.queries.auth().queryKey,
          });
        },
      }),

    signup: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.auth.signup.call>) =>
          orpc.auth.signup.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.refetchQueries({
            queryKey: service_auth.queries.auth().queryKey,
          });
        },
      }),

    logout: (args: { router: ReturnType<typeof useRouter> }) =>
      mutationOptions({
        mutationFn: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            throw new Error(error.message);
          }

          args.router.push(paths.auth.login);

          queryClient.removeQueries();
        },
        onError: async (error) => {
          console.error(error);

          args.router.push(paths.auth.login);

          queryClient.removeQueries();
        },
      }),
  },
} as const;

export const useAuthQuery = () => usePublicQuery(service_auth.queries.auth());
