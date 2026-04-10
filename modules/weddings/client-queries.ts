import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import {
  queryClient,
  useSessionQuery,
} from '@/integrations/tanstack-query/query';

export const service_weddings = {
  queries: {
    mine: () =>
      queryOptions({
        queryKey: orpc.weddings.listMine.queryOptions().queryKey,
        queryFn: () => orpc.weddings.listMine.call().then(okOrThrow),
      }),
  },
  mutations: {
    create: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.weddings.create.call>) =>
          orpc.weddings.create.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_weddings.queries.mine().queryKey,
          });
        },
      }),

    update: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.weddings.update.call>) =>
          orpc.weddings.update.call(args).then(okOrThrow),
      }),
  },
} as const;

export const useMyWeddingsQuery = () =>
  useSessionQuery(service_weddings.queries.mine());
