import { PageLayout } from '@/components/ui/layout/PageLayout';
import { DashboardSidebar } from '@/modules/events/components/DashboardSidebar';

export default async function EventDashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ eventSlug: string }>;
}>) {
  const { eventSlug } = await params;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] md:grid-rows-1">
      <DashboardSidebar eventSlug={eventSlug} />

      <PageLayout className="overflow-y-auto">{children}</PageLayout>
    </div>
  );
}
