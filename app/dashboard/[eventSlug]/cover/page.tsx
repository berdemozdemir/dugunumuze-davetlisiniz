import { notFound } from 'next/navigation';
import { InvitationCoverPageEditor } from '@/modules/invitation/components/InvitationCoverPageEditor';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';

export default async function EventCoverPage({
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

  const w = wData.event;
  const merged = sErr ? null : sData.merged;

  return (
    <InvitationCoverPageEditor
      eventSlug={eventSlug}
      eventId={w.id}
      defaultValues={{
        partner1Name: w.partner1Name,
        partner2Name: w.partner2Name,
        heroImageUri: merged?.heroImageUri?.trim(),
        heroEyebrow: merged?.heroEyebrow?.trim() ?? '',
        heroTagline: merged?.heroTagline?.trim() ?? '',
        heroDateLine: merged?.heroDateLine?.trim() ?? '',
      }}
      invitationSettingsReady={!sErr}
    />
  );
}
