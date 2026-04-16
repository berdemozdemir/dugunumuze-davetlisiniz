import { notFound } from 'next/navigation';
import { InvitationCountdownEditor } from '@/modules/invitation/components/InvitationCountdownEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { toDateTimeLocal } from '@/modules/weddings/util';

export default async function WeddingCountdownPage({
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
      <p className="text-muted-foreground text-sm">
        Şablon ayarları geçici olarak kullanılamıyor.
      </p>
    );
  }

  const merged = sData.merged;

  return (
    <InvitationCountdownEditor
      weddingSlug={weddingSlug}
      defaultValues={{
        countdownEvents: (merged.countdownEvents ?? []).map((e) => ({
          title: e.title,
          dateTime: toDateTimeLocal(new Date(e.dateTime)),
          subtitle: e.subtitle ?? '',
        })),
      }}
    />
  );
}
