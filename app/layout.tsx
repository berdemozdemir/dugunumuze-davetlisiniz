import type { Metadata } from 'next';
import { Playfair_Display, Great_Vibes, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elif ve Erdem - Düğünümüze Davetlisiniz',
  description:
    'Elif ve Erdem evleniyor! 4 ve 11 Temmuz 2026 - Düğünümüze davetlisiniz.',
  openGraph: {
    title: 'Elif ve Erdem - Düğünümüze Davetlisiniz',
    description: 'Elif ve Erdem evleniyor! Sizi de aramızda görmek istiyoruz.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={cn(
        'scroll-smooth',
        playfair.variable,
        greatVibes.variable,
        'font-sans',
        geist.variable,
      )}
    >
      {/* TODO: this should be refactored after admin dashboard is ready */}
      <head>
        <link
          rel="preload"
          href="/music/cihat-askin-kelebek.mp3"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>

      <body className="bg-background text-foreground min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
