import { paths } from '@/lib/paths';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IconCalendarEvent } from '@tabler/icons-react';
import { formatEventDateTime } from '../util/format-event-datetime';
import { IconChevronRight } from '@tabler/icons-react';
import type { DashboardEventListItem } from '../types';

export function EventCard({ event }: { event: DashboardEventListItem }) {
  const title = `${event.partner1Name} & ${event.partner2Name}`;
  const isPublished = event.publishedAt !== null;

  return (
    <Link
      href={paths.dashboard.event.overview(event.slug)}
      className={cn(
        'border-border/60 bg-card group flex h-full flex-col rounded-xl border p-4 shadow-sm transition-colors',
        'hover:border-border hover:bg-muted/40',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>

          <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
            <IconCalendarEvent className="size-3.5 shrink-0" aria-hidden />

            {formatEventDateTime(event.dateTime)}
          </p>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase',
            isPublished
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-500/15 text-amber-800 dark:text-amber-400',
          )}
        >
          {isPublished ? 'Yayında' : 'Taslak'}
        </span>
      </div>

      <p className="text-muted-foreground mt-3 truncate font-mono text-[0.7rem]">
        /{event.slug}
      </p>

      <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
        Yönet
        <IconChevronRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
