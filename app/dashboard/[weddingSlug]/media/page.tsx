import { notFound } from 'next/navigation';
import { InvitationMediaPageEditor } from '@/modules/invitation/components/InvitationMediaPageEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';

export default async function WeddingMediaPage({
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

  const merged = sErr ? null : sData.merged;

  return (
    <InvitationMediaPageEditor
      weddingSlug={weddingSlug}
      weddingId={wData.wedding.id}
      mediaDefaults={{
        musicTrackPath: merged?.musicTrackPath?.trim(),
        musicTrimStartSec: merged?.musicTrimStartSec,
        musicTrimEndSec: merged?.musicTrimEndSec,
      }}
      invitationSettingsReady={!sErr}
    />
  );
}
