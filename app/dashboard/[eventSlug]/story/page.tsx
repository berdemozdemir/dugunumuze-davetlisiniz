import { notFound } from 'next/navigation';
import { InvitationStoryTextEditor } from '@/modules/invitation/components/InvitationStoryTextEditor';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';

export default async function EventStoryPage({
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
  if (sErr) {
    return (
      <p className="text-muted-foreground text-sm">
        Şablon ayarları geçici olarak kullanılamıyor.
      </p>
    );
  }

  const merged = sData.merged;

  return (
    <InvitationStoryTextEditor
      eventSlug={eventSlug}
      eventId={wData.event.id}
      defaultValues={{
        storyHeadline: merged.storyHeadline ?? '',
        storySubline: merged.storySubline ?? '',
        storyImageUri: merged.storyImageUri?.trim(),
      }}
    />
  );
}
