import Header from '@/modules/header/components/Header';

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <Header />

      <main className="flex-1">{children}</main>
      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        Düğünümüze Davetlisiniz
      </footer>
    </div>
  );
}
