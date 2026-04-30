import { notFound } from 'next/navigation';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';
import { toDateTimeLocal } from '@/modules/events/util';
import { CountdownEditorClient } from './CountdownEditorClient';

export default async function EventCountdownPage({
  params,
}: Readonly<{
  params: Promise<{ eventSlug: string }>;
}>) {
  const { eventSlug } = await params;

  const [wErr] = await orpc_getEventBySlug({ eventSlug });
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
  const e = merged.countdownEvent;

  return (
    <CountdownEditorClient
      eventSlug={eventSlug}
      defaultValues={{
        countdownEvent: {
          title: e.title,
          dateTime: toDateTimeLocal(new Date(e.dateTime)),
          subtitle: e.subtitle ?? '',
          venueName: e.venueName ?? '',
          addressText: e.addressText ?? '',
          city: e.city ?? '',
        },
      }}
    />
  );
}
