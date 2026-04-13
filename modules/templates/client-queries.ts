import { mutationOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';

export const service_templates = {
  mutations: {
    updateWeddingInvitationOverrides: () =>
      mutationOptions({
        mutationFn: (
          args: ArgsOf<typeof orpc.templates.updateWeddingInvitationOverrides.call>,
        ) =>
          orpc.templates.updateWeddingInvitationOverrides.call(args).then(okOrThrow),
      }),
  },
} as const;

