import { PageLayout } from '@/components/ui/layout/PageLayout';
import { DashboardSidebar } from '@/modules/weddings/components/DashboardSidebar';

export default async function WeddingDashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ weddingSlug: string }>;
}>) {
  const { weddingSlug } = await params;

  return (
    <div className="grid min-h-dvh grid-cols-1 md:h-dvh md:min-h-0 md:grid-cols-[260px_1fr] md:grid-rows-1">
      <DashboardSidebar weddingSlug={weddingSlug} />

      {/* TODO: fix 2 scrollbar issue */}
      <PageLayout className="min-h-0 overflow-y-auto">{children}</PageLayout>
    </div>
  );
}
