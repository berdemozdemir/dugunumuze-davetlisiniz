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
    <div className="flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
      <DashboardSidebar eventSlug={eventSlug} />

      <div className="min-h-0 w-full flex-1 md:overflow-y-auto">
        <PageLayout>{children}</PageLayout>
      </div>
    </div>
  );
}
