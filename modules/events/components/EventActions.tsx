'use client';

import { Button } from '@/components/ui/Button';
import { paths } from '@/lib/paths';
import { IconClick, IconPencil, IconShare } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'sonner';

export const EventActions: FC<{ eventSlug: string }> = ({ eventSlug }) => {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button
        variant="link"
        onClick={() => router.push(paths.invitation.base(eventSlug))}
      >
        Görüntüle
        <IconClick className="size-4" />
      </Button>

      <Button
        variant="link"
        onClick={() => router.push(paths.dashboard.event.cover(eventSlug))}
      >
        Düzenle
        <IconPencil className="size-4" />
      </Button>

      <Button
        variant="link"
        onClick={() => {
          navigator.clipboard.writeText(
            window.location.origin + paths.invitation.base(eventSlug),
          );

          toast.success('Davetiye linki kopyalandı');
        }}
      >
        Paylaş
        <IconShare className="size-4" />
      </Button>
    </div>
  );
};
