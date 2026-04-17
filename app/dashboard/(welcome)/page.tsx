import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { DashboardHomeView } from '@/modules/dashboard-home/components/DashboardHomeView';
import type { DashboardWeddingListItem } from '@/modules/dashboard-home/types';
import { orpc_weddings_listMine } from '@/modules/weddings/actions/list-mine';

export default async function DashboardPage() {
  const [listErr, data] = await orpc_weddings_listMine();

  if (listErr) {
    console.error(listErr);
    redirect(paths.auth.login);
  }

  const weddings: DashboardWeddingListItem[] = data.weddings.map((w) => ({
    id: w.id,
    slug: w.slug,
    partner1Name: w.partner1Name,
    partner2Name: w.partner2Name,
    dateTime: w.dateTime,
    publishedAt: w.publishedAt,
    createdAt: w.createdAt,
  }));

  return <DashboardHomeView weddings={weddings} />;
}
