import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { orpc_getLatestWeddingSlug } from '@/modules/weddings/actions/get-latest-wedding-slug';

export default async function DashboardPage() {
  const [latestWeddingSlugErr, data] = await orpc_getLatestWeddingSlug();

  if (latestWeddingSlugErr) {
    redirect(paths.auth.login);
  }

  if (!data.slug) {
    redirect(paths.dashboard.new);
  }

  redirect(paths.dashboard.wedding.overview(data.slug));
}
