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
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[260px_1fr]">
      <DashboardSidebar weddingSlug={weddingSlug} />

      <PageLayout>{children}</PageLayout>
    </div>
  );
}
