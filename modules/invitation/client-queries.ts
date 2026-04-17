import { mutationOptions } from '@tanstack/react-query';
import { okOrThrow, type ArgsOf } from '@/lib/result';
import { orpc } from '@/integrations/orpc/client';

/** Dashboard davetiye düzenleyicisi — tek modül, tek client-queries dosyası */
export const invitation_dashboard = {
  mutations: {
    updateCover: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.invitation.updateCover.call>) =>
          orpc.invitation.updateCover.call(args).then(okOrThrow),
      }),
    updateClosing: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.invitation.updateClosing.call>) =>
          orpc.invitation.updateClosing.call(args).then(okOrThrow),
      }),
    updateCountdown: () =>
      mutationOptions({
        mutationFn: (
          args: ArgsOf<typeof orpc.invitation.updateCountdown.call>,
        ) => orpc.invitation.updateCountdown.call(args).then(okOrThrow),
      }),
    updateStoryText: () =>
      mutationOptions({
        mutationFn: (
          args: ArgsOf<typeof orpc.invitation.updateStoryText.call>,
        ) => orpc.invitation.updateStoryText.call(args).then(okOrThrow),
      }),
    updateVisibility: () =>
      mutationOptions({
        mutationFn: (
          args: ArgsOf<typeof orpc.invitation.updateVisibility.call>,
        ) => orpc.invitation.updateVisibility.call(args).then(okOrThrow),
      }),
    updateMedia: () =>
      mutationOptions({
        mutationFn: (args: ArgsOf<typeof orpc.invitation.updateMedia.call>) =>
          orpc.invitation.updateMedia.call(args).then(okOrThrow),
      }),
  },
} as const;
