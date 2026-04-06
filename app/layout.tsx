import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elif & Erdem - Düğünümüze Davetlisiniz",
  description:
    "Elif & Erdem evleniyor! 4 & 11 Temmuz 2026 - Düğünümüze davetlisiniz.",
  openGraph: {
    title: "Elif & Erdem - Düğünümüze Davetlisiniz",
    description: "Elif ve Erdem evleniyor! Sizi de aramızda görmek istiyoruz.",
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
      className={`${playfair.variable} ${greatVibes.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="preload"
          href="/music/cihat-askin-kelebek.mp3"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-deep text-cream antialiased">
        {children}

        <footer className="py-8 text-center border-t border-white/5">
          <p className="text-cream/30 text-xs tracking-wider">
            Elif & Erdem &middot; 2026
          </p>
        </footer>
      </body>
    </html>
  );
}
