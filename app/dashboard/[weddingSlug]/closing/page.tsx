import { notFound } from 'next/navigation';
import { InvitationClosingEditor } from '@/modules/invitation/components/InvitationClosingEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';

export default async function WeddingClosingPage({
  params,
}: Readonly<{
  params: Promise<{ weddingSlug: string }>;
}>) {
  const { weddingSlug } = await params;

  const [wErr, wData] = await orpc_getWeddingBySlug({ weddingSlug });
  if (wErr) {
    notFound();
  }

  const [sErr, sData] = await orpc_templates_getWeddingInvitationSettings({
    weddingSlug,
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
    <InvitationClosingEditor
      weddingSlug={weddingSlug}
      weddingId={wData.wedding.id}
      defaultValues={{
        quote: merged.quote ?? '',
        closingNote: merged.closingNote ?? '',
        closingPhotoUris: (merged.closingPhotoUris ?? [])
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 10),
      }}
    />
  );
}
