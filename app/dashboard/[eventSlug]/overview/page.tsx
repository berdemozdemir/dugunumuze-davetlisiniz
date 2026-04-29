import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';
import { PublishEventButtons } from '@/modules/events/components/PublishEventButtons';
import { InvitationIframePreview } from '@/modules/events/components/InvitationIframePreview';
import { EventActions } from '@/modules/events/components/EventActions';

export default async function EventOverviewPage({
  params,
}: Readonly<{
  params: Promise<{ eventSlug: string }>;
}>) {
  const { eventSlug } = await params;

  const [loadErr, data] = await orpc_getEventBySlug({ eventSlug });

  if (loadErr) {
    console.error(loadErr?.message);
    redirect(paths.dashboard.base);
  }

  const event = data.event;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {event.secondaryName
            ? `${event.primaryName} ve ${event.secondaryName}`
            : event.primaryName}
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Kısa adres: <span className="font-mono">{event.slug}</span>
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>
            {/* TODO: this should show warning if the missing parts exists (like hero image, countdown, etc.) */}
            Durum:{' '}
            {event.publishedAt ? (
              <span className="text-emerald-600">Yayınlandı</span>
            ) : (
              <span className="text-amber-600">Taslak</span>
            )}
          </span>

          <PublishEventButtons
            eventSlug={event.slug}
            isPublished={!!event.publishedAt}
          />
        </div>

        <EventActions eventSlug={event.slug} />
      </div>

      <div className="grid gap-3">
        <h2 className="text-sm font-medium">Önizleme</h2>

        <p className="text-muted-foreground -mt-2 text-xs">
          Taslak dahil birebir herkese açık davetiye sayfası önizlemesi.
        </p>

        <InvitationIframePreview slug={event.slug} />
      </div>
    </div>
  );
}
