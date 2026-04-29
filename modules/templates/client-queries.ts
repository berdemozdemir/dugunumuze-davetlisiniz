import { queryOptions } from '@tanstack/react-query';
import { okOrThrow } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';

export const service_templates = {
  queries: {
    list: () =>
      queryOptions({
        queryKey: orpc.templates.list.queryOptions().queryKey,
        queryFn: () => orpc.templates.list.call().then(okOrThrow),
      }),
  },
} as const;

