import { notFound } from 'next/navigation';
import { InvitationVisibilityEditor } from '@/modules/invitation/components/InvitationVisibilityEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';

export default async function WeddingSettingsPage({
  params,
}: Readonly<{
  params: Promise<{ weddingSlug: string }>;
}>) {
  const { weddingSlug } = await params;

  const [wErr] = await orpc_getWeddingBySlug({ weddingSlug });
  if (wErr) {
    notFound();
  }

  const [sErr, sData] = await orpc_templates_getWeddingInvitationSettings({
    weddingSlug,
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
        weddingSlug={weddingSlug}
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
