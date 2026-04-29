import { redirect } from 'next/navigation';
import { paths } from '@/lib/paths';
import { DashboardHomeView } from '@/modules/dashboard-home/components/DashboardHomeView';
import type { DashboardEventListItem } from '@/modules/dashboard-home/types';
import { orpc_events_listMine } from '@/modules/events/actions/list-mine';

export default async function DashboardPage() {
  const [listErr, data] = await orpc_events_listMine();

  if (listErr) {
    console.error(listErr);
    redirect(paths.auth.login);
  }

  const events: DashboardEventListItem[] = data.events.map((w) => ({
    id: w.id,
    slug: w.slug,
    templateName: w.templateName,
    primaryName: w.primaryName,
    secondaryName: w.secondaryName ?? undefined,
    dateTime: w.dateTime,
    publishedAt: w.publishedAt,
    createdAt: w.createdAt,
  }));

  return <DashboardHomeView events={events} />;
}
