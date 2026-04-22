import { notFound } from 'next/navigation';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';
import { orpc_rsvp_getOwnerSummary } from '@/modules/rsvp/actions/get-owner-summary';
import { RsvpDashboard } from '@/modules/rsvp/components/RsvpDashboard';

export default async function EventRsvpPage({
  params,
}: Readonly<{
  params: Promise<{ eventSlug: string }>;
}>) {
  const { eventSlug } = await params;

  const [wErr] = await orpc_getEventBySlug({ eventSlug });
  if (wErr) {
    notFound();
  }

  const summaryResult = await orpc_rsvp_getOwnerSummary({ eventSlug });

  if (summaryResult[0]) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Rezervasyon</h1>
        <p className="text-muted-foreground text-sm">
          Ayarlar yüklenemedi. Şablon bağlantısını kontrol edin.
        </p>
      </div>
    );
  }

  return <RsvpDashboard eventSlug={eventSlug} summary={summaryResult[1]} />;
}
