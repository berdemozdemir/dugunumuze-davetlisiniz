import { notFound } from 'next/navigation';
import { InvitationStoryTextEditor } from '@/modules/invitation/components/InvitationStoryTextEditor';
import { orpc_templates_getWeddingInvitationSettings } from '@/modules/templates/actions/get-wedding-invitation-settings';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';

export default async function WeddingStoryPage({
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
    <InvitationStoryTextEditor
      weddingSlug={weddingSlug}
      defaultValues={{
        storyHeadline: merged.storyHeadline ?? '',
        storySubline: merged.storySubline ?? '',
      }}
    />
  );
}
