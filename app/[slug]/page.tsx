import { redirect } from 'next/navigation';
import { orpc_getInvitationBySlug } from '@/modules/templates/actions/get-invitation-by-slug';
import { paths } from '@/lib/paths';

export default async function PublicInvitationPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;

  const [invErr, data] = await orpc_getInvitationBySlug({ slug });

  if (invErr) {
    if (invErr.reason === 'not-published') {
      return (
        // TODO: create another page content with better ux
        <main className="mx-auto max-w-3xl p-8">
          <h1 className="text-2xl font-semibold">Bu davetiye yayında değil</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Düğün sahibi davetiyeyi yayınladıktan sonra tekrar deneyin.
          </p>
        </main>
      );
    }

    redirect(paths.home);
  }

  const invitation = data.invitation;
  const date = new Date(invitation.dateTime);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">
        {invitation.partner1Name} &amp; {invitation.partner2Name}
      </h1>
      <p className="text-muted-foreground mt-2">
        {date.toLocaleString('tr-TR')} · {invitation.city}
        {invitation.venueName ? ` · ${invitation.venueName}` : ''}
      </p>

      <div className="mt-6 rounded-lg border p-4">
        <div className="text-sm font-medium">Adres</div>
        <div className="text-muted-foreground mt-1 text-sm">
          {invitation.addressText}
        </div>
      </div>
    </main>
  );
}
