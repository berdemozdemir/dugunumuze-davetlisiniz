import { Authenticated } from '@/components/ui/layout/Authenticated';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authenticated>
      <div className="min-h-dvh">{children}</div>
    </Authenticated>
  );
}
