import { notFound } from 'next/navigation';
import { InvitationCoverPageEditor } from '@/modules/invitation/components/InvitationCoverPageEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { toDateTimeLocal } from '@/modules/weddings/util';

export default async function WeddingCoverPage({
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

  const w = wData.wedding;
  const merged = sErr ? null : sData.merged;

  return (
    <InvitationCoverPageEditor
      weddingSlug={weddingSlug}
      weddingId={w.id}
      weddingDefaults={{
        partner1Name: w.partner1Name,
        partner2Name: w.partner2Name,
        dateTime: toDateTimeLocal(new Date(w.dateTime)),
        city: w.city,
        venueName: w.venueName ?? '',
        addressText: w.addressText,
      }}
      coverDefaults={{
        heroImageUri: merged?.heroImageUri?.trim(),
      }}
      invitationSettingsReady={!sErr}
    />
  );
}
