import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';

export const rsvp_public = {
  mutations: {
    submit: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.rsvp.submit.call>) =>
          orpc.rsvp.submit.call(args).then(okOrThrow),
      }),
  },
} as const;

export const rsvp_dashboard = {
  queries: {
    listResponses: (eventSlug: string) =>
      queryOptions({
        queryKey: ['rsvp', 'listResponses', eventSlug],
        queryFn: () =>
          orpc.rsvp.listResponses.call({ eventSlug }).then(okOrThrow),
      }),
  },
  mutations: {
    updateSettings: () =>
      mutationOptions({
        mutationFn: (
          args: ArgsOf<typeof orpc.rsvp.updateSettings.call>,
        ) => orpc.rsvp.updateSettings.call(args).then(okOrThrow),
      }),
  },
} as const;
