import type { Metadata } from 'next';
import Link from 'next/link';
import Ornament from '@/components/Ornament';

export const metadata: Metadata = {
  title: 'Yetkisiz erişim | Elif & Erdem',
  description: 'Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.',
};

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/3 h-[min(58vw,26rem)] w-[min(58vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(114,47,55,0.22)_0%,transparent_68%)]" />
      </div>

      <div className="relative z-10 max-w-lg text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold-light/90">
          Düğünümüze davetlisiniz
        </p>

        <div
          className="animate-fade-in-up mb-6"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <span className="font-cursive text-6xl sm:text-7xl md:text-8xl leading-none bg-linear-to-br from-burgundy/95 via-rose/90 to-burgundy/80 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
            401
          </span>
        </div>

        <Ornament />

        <h1 className="font-display mt-8 text-2xl font-normal italic tracking-wide text-cream sm:text-3xl">
          Bu alan davetli misafirlerimize özel
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-cream/65 sm:text-base">
          Bu sayfayı görüntülemek için giriş yapmanız veya uygun yetkiye sahip
          olmanız gerekir. Ana sayfaya dönebilir veya hesabınızla giriş
          yapabilirsiniz.
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/auth/login"
            className="inline-flex min-w-48 items-center justify-center rounded-lg border border-gold/45 bg-gold/10 px-8 py-3 text-sm font-medium text-cream shadow-[0_0_24px_rgba(212,175,55,0.08)] transition hover:border-gold/70 hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/50"
          >
            Giriş yap
          </Link>
          <Link
            href="/"
            className="inline-flex min-w-48 items-center justify-center rounded-lg border border-white/15 bg-transparent px-8 py-3 text-sm font-medium text-cream/90 transition hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
