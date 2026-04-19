import { notFound } from 'next/navigation';
import { InvitationVisibilityEditor } from '@/modules/invitation/components/InvitationVisibilityEditor';
import { orpc_templates_getEventInvitationSettings } from '@/modules/templates/actions/get-event-invitation-settings';
import { orpc_getEventBySlug } from '@/modules/events/actions/get-event-by-slug';

export default async function EventSettingsPage({
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
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Ayarlar</h1>
        <p className="text-muted-foreground text-sm">
          Şablon ayarları geçici olarak kullanılamıyor; davetiye bölüm
          görünürlükleri şu an düzenlenemiyor.
        </p>
      </div>
    );
  }

  const merged = sData.merged;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Ayarlar</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Davetiye ve hesap ile ilgili tercihler. Aşağıda herkese açık
          davetiye sayfasında hangi blokların listeleneceğini seçersiniz.
        </p>
      </div>

      <InvitationVisibilityEditor
        eventSlug={eventSlug}
        defaultValues={{
          sections: {
            hero: merged.sections?.hero ?? true,
            countdown: merged.sections?.countdown ?? true,
            story: merged.sections?.story ?? true,
            details: merged.sections?.details ?? true,
            closing: merged.sections?.closing ?? true,
            musicPlayer: merged.sections?.musicPlayer ?? true,
          },
        }}
      />
    </div>
  );
}
