'use client';

import { useEffect, useState } from 'react';
import type { TimeLeft } from '@/lib/types';
import { calculateTimeLeft } from '@/lib/util';
import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import CountdownRow from '@/components/CountdownRow';

const SKELETON = [0, 1, 2, 3] as const;

type Props = {
  targetIso: string;
  /** Örn. şehir veya mekân kısa satırı */
  subtitle: string;
};

export function InvitationCountdown({ targetIso, subtitle }: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetIso);
    const tick = () => setTime(calculateTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return (
    <section className="relative px-4 py-20 sm:py-28">
      <div className="from-deep via-deep-light to-deep absolute inset-0 bg-linear-to-b" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <RevealSection className="mb-16 text-center">
          <h2 className="font-cursive text-gold mb-3 text-4xl sm:text-5xl md:text-6xl">
            Düğünümüze Kalan Süre
          </h2>

          <div className="mt-4">
            <Ornament />
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="border-gold/30 from-gold/10 to-burgundy/10 animate-pulse-glow relative rounded-3xl border bg-linear-to-br via-transparent p-6 sm:p-8 md:p-10">
            <div className="mb-6 text-center sm:mb-8">
              <h3 className="font-cursive text-gold mb-1 text-3xl sm:text-4xl">
                Düğün
              </h3>
              <p className="text-cream/70 text-sm sm:text-base">{subtitle}</p>
            </div>

            {/* FUTURE-MD-NOTE: this should be rule, define this one more explicit */}
            {time ? (
              <CountdownRow time={time} large />
            ) : (
              <div className="flex justify-center gap-4 sm:gap-6">
                {SKELETON.map((i) => (
                  <div
                    key={i}
                    className="countdown-digit h-18 w-18 animate-pulse rounded-xl bg-white/5 sm:h-24 sm:w-24 md:h-28 md:w-28"
                  />
                ))}
              </div>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
