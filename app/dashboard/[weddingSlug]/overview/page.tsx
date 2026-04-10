import Link from 'next/link';
import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { orpc_getWeddingBySlug } from '@/modules/weddings/actions/get-wedding-by-slug';
import { PublishWeddingButtons } from '@/modules/weddings/components/PublishWeddingButtons';

export default async function WeddingOverviewPage({
  params,
}: Readonly<{
  params: Promise<{ weddingSlug: string }>;
}>) {
  const { weddingSlug } = await params;

  const [weddingErr, data] = await orpc_getWeddingBySlug({ weddingSlug });

  if (weddingErr) {
    console.error(weddingErr?.message);
    redirect(paths.dashboard.base);
  }

  const wedding = data.wedding;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {wedding.partner1Name} &amp; {wedding.partner2Name}
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Invitation slug: <span className="font-mono">{wedding.slug}</span>
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>
            Status:{' '}
            {wedding.publishedAt ? (
              <span className="text-emerald-600">Published</span>
            ) : (
              <span className="text-amber-600">Draft</span>
            )}
          </span>

          <PublishWeddingButtons
            weddingSlug={wedding.slug}
            isPublished={!!wedding.publishedAt}
          />
        </div>

        <div className="flex gap-3">
          <Link
            className="underline"
            href={paths.invitation(wedding.slug)}
          >
            View invitation
          </Link>

          <Link
            className="underline"
            href={paths.dashboard.wedding.invitation(wedding.slug)}
          >
            Edit invitation
          </Link>
        </div>
      </div>
    </div>
  );
}
