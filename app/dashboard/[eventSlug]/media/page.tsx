import { notFound } from 'next/navigation';
import { InvitationMediaPageEditor } from '@/modules/invitation/components/InvitationMediaPageEditor';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';

export default async function EventMediaPage({
  params,
}: Readonly<{
  params: Promise<{ eventSlug: string }>;
}>) {
  const { eventSlug } = await params;

  const [wErr, wData] = await orpc_getEventBySlug({ eventSlug });
  if (wErr) {
    notFound();
  }

  const [sErr, sData] = await orpc_templates_getEventInvitationSettings({
    eventSlug,
  });

  const merged = sErr ? null : sData.merged;

  return (
    <InvitationMediaPageEditor
      eventSlug={eventSlug}
      eventId={wData.event.id}
      mediaDefaults={{
        musicTrackPath: merged?.musicTrackPath?.trim(),
        musicTrimStartSec: merged?.musicTrimStartSec,
        musicTrimEndSec: merged?.musicTrimEndSec,
      }}
      invitationSettingsReady={!sErr}
    />
  );
}
