import { cn } from '@/lib/utils';
import { IconCalendarEvent } from '@tabler/icons-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { paths } from '@/lib/paths';

export function EmptyState() {
  return (
    <div
      className={cn(
        'border-border/60 bg-muted/30 rounded-2xl border border-dashed p-10',
        'text-center',
      )}
    >
      <div className="bg-background/80 mx-auto mb-4 flex size-12 items-center justify-center rounded-full border shadow-sm">
        <IconCalendarEvent
          className="text-muted-foreground size-6"
          stroke={1.5}
          aria-hidden
        />
      </div>

      <h2 className="text-lg font-medium">Henüz etkinlik yok</h2>

      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        İlk davet sayfanızı oluşturduğunuzda burada listelenecek; istediğiniz
        kadar ayrı etkinlik ekleyebilirsiniz.
      </p>

      <Button asChild className="mt-6">
        <Link href={paths.dashboard.new}>İlk etkinliğini oluştur</Link>
      </Button>
    </div>
  );
}
