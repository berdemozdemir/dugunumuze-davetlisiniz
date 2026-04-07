import type { Metadata } from 'next';
import Link from 'next/link';
import Ornament from '@/components/Ornament';

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı | Elif & Erdem',
  description: 'Aradığınız sayfa bulunamadı.',
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/3 h-[min(60vw,28rem)] w-[min(60vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-lg text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold-light/90">
          Düğünümüze davetlisiniz
        </p>

        <div
          className="animate-fade-in-up mb-6"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <span className="font-cursive text-7xl sm:text-8xl gold-gradient-text leading-none">
            404
          </span>
        </div>

        <Ornament />

        <h1 className="font-display mt-8 text-2xl font-normal italic tracking-wide text-cream sm:text-3xl">
          Bu sayfayı bulamadık
        </h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-cream/65 sm:text-base">
          Adres yanlış olabilir veya sayfa taşınmış olabilir. Ana sayfadan
          düğün detaylarına dönebilirsiniz.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-w-48 items-center justify-center rounded-lg border border-gold/45 bg-gold/10 px-8 py-3 text-sm font-medium text-cream shadow-[0_0_24px_rgba(212,175,55,0.08)] transition hover:border-gold/70 hover:bg-gold/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/50"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}
