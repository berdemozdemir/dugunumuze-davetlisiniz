import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { EditWeddingForm } from '@/modules/weddings/components/EditWeddingForm';
import { toDateTimeLocal } from '@/modules/weddings/utils/date';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { InvitationOverridesForm } from '@/modules/templates/components/InvitationOverridesForm';

export default async function WeddingInvitationPage({
  params,
}: Readonly<{
  params: Promise<{ weddingSlug: string }>;
}>) {
  const { weddingSlug } = await params;

  const [weddingErr, data] = await orpc_getWeddingBySlug({ weddingSlug });
  const [settingsErr, settingsData] =
    await orpc_templates_getWeddingInvitationSettings({ weddingSlug });

  if (weddingErr) {
    redirect(paths.dashboard.base);
  }

  const wedding = data.wedding;
  const mergedTemplate = settingsErr ? null : settingsData.merged;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Invitation</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Details shown on your public invitation.
      </p>

      <EditWeddingForm
        weddingSlug={wedding.slug}
        defaultValues={{
          partner1Name: wedding.partner1Name,
          partner2Name: wedding.partner2Name,
          dateTime: toDateTimeLocal(new Date(wedding.dateTime)),
          city: wedding.city,
          venueName: wedding.venueName ?? '',
          addressText: wedding.addressText,
        }}
      />

      {mergedTemplate ? (
        <InvitationOverridesForm weddingSlug={wedding.slug} merged={mergedTemplate} />
      ) : (
        <div className="text-muted-foreground mt-10 text-sm">
          Template settings are temporarily unavailable.
        </div>
      )}
    </div>
  );
}

