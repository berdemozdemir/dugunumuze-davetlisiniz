import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';
import { queryClient } from '@/integrations/tanstack-query/query';

export const service_events = {
  queries: {
    mine: () =>
      queryOptions({
        queryKey: orpc.events.listMine.queryOptions().queryKey,
        queryFn: () => orpc.events.listMine.call().then(okOrThrow),
      }),
  },
  mutations: {
    create: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.events.create.call>) =>
          orpc.events.create.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_events.queries.mine().queryKey,
          });
        },
      }),

    publish: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.events.publish.call>) =>
          orpc.events.publish.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_events.queries.mine().queryKey,
          });
        },
      }),

    unpublish: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.events.unpublish.call>) =>
          orpc.events.unpublish.call(args).then(okOrThrow),
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: service_events.queries.mine().queryKey,
          });
        },
      }),
  },
} as const;
