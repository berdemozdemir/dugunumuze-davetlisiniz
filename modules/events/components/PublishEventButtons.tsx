'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { service_events } from '../client-queries';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Props = {
  eventSlug: string;
  isPublished: boolean;
};

export function PublishEventButtons({ eventSlug, isPublished }: Props) {
  const router = useRouter();

  const publishMutation = useMutation(service_events.mutations.publish());
  const unpublishMutation = useMutation(service_events.mutations.unpublish());

  const pending = publishMutation.isPending || unpublishMutation.isPending;

  const handlePublish = async () => {
    await publishMutation.mutateAsync({ eventSlug });

    toast.success('Davetiye yayında');

    router.refresh();
  };

  const handleUnpublish = async () => {
    await unpublishMutation.mutateAsync({ eventSlug });
    toast.success('Davetiye taslak olarak kaydedildi');
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isPublished && (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={handleUnpublish}
        >
          {unpublishMutation.isPending ? <LoadingSpinner /> : null}
          Taslağa al
        </Button>
      )}

      {!isPublished && (
        <Button type="button" disabled={pending} onClick={handlePublish}>
          {publishMutation.isPending ? <LoadingSpinner /> : null}
          Yayınla
        </Button>
      )}

      {(publishMutation.error || unpublishMutation.error) && (
        <span className="text-destructive text-sm">
          {(publishMutation.error ?? unpublishMutation.error)?.message}
        </span>
      )}
    </div>
  );
}
