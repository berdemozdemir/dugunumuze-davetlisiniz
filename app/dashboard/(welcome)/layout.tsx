import { Authenticated } from '@/components/ui/layout/Authenticated';
import Header from '@/modules/header/components/Header';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authenticated>
      <Header />

      <div className="min-h-dvh">{children}</div>
    </Authenticated>
  );
}
