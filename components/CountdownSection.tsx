'use client';

import { useState, useEffect } from 'react';
import { TimeLeft } from '@/lib/types';
import { calculateTimeLeft } from '@/lib/util';
import { KINA_DATE, ELAZIG_DATE, ANKARA_DATE } from '@/lib/constants';
import RevealSection from './RevealSection';
import Ornament from './Ornament';
import CountdownRow from './CountdownRow';

const SKELETON = [0, 1, 2, 3] as const;

const CountdownSection = () => {
  const [kinaTime, setKinaTime] = useState<TimeLeft | null>(null);
  const [elazigTime, setElazigTime] = useState<TimeLeft | null>(null);
  const [ankaraTime, setAnkaraTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => {
      setKinaTime(calculateTimeLeft(KINA_DATE));
      setElazigTime(calculateTimeLeft(ELAZIG_DATE));
      setAnkaraTime(calculateTimeLeft(ANKARA_DATE));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative px-4 py-20 sm:py-28">
      <div className="from-deep via-deep-light to-deep absolute inset-0 bg-linear-to-b" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <RevealSection className="mb-16 text-center">
          <h2 className="font-cursive gold-shimmer-text mb-3 text-4xl sm:text-5xl md:text-6xl">
            Düğünümüze Kalan Süre
          </h2>
          <div className="mt-4">
            <Ornament />
          </div>
        </RevealSection>

        <div className="space-y-6">
          {/* 1. Kına - 2 Temmuz */}
          <RevealSection delay={200}>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6 md:p-8">
              <div className="mb-5 text-center sm:mb-6">
                <h3 className="font-cursive text-rose mb-1 text-2xl sm:text-3xl">
                  Kına Gecesi
                </h3>
                <p className="text-cream/50 text-xs sm:text-sm">
                  2 Temmuz 2026 &middot; Perşembe &middot; Elazığ
                </p>
              </div>
              {kinaTime ? (
                <CountdownRow time={kinaTime} />
              ) : (
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                  {SKELETON.map((i) => (
                    <div
                      key={i}
                      className="countdown-digit h-14 w-14 animate-pulse rounded-xl bg-white/5 sm:h-16 sm:w-16 md:h-20 md:w-20"
                    />
                  ))}
                </div>
              )}
            </div>
          </RevealSection>

          {/* 2. Elazığ Düğünü - 4 Temmuz */}
          <RevealSection delay={300}>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6 md:p-8">
              <div className="mb-5 text-center sm:mb-6">
                <h3 className="font-cursive text-gold/80 mb-1 text-2xl sm:text-3xl">
                  Elazığ Düğünü
                </h3>
                <p className="text-cream/50 text-xs sm:text-sm">
                  4 Temmuz 2026 &middot; Cumartesi &middot; Kral Palace
                </p>
              </div>
              {elazigTime ? (
                <CountdownRow time={elazigTime} />
              ) : (
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                  {SKELETON.map((i) => (
                    <div
                      key={i}
                      className="countdown-digit h-14 w-14 animate-pulse rounded-xl bg-white/5 sm:h-16 sm:w-16 md:h-20 md:w-20"
                    />
                  ))}
                </div>
              )}
            </div>
          </RevealSection>

          {/* 3. Ankara Düğünü - 11 Temmuz */}
          <RevealSection delay={400}>
            <div className="from-gold/10 to-burgundy/10 border-gold/30 animate-pulse-glow relative rounded-3xl border bg-linear-to-br via-transparent p-6 sm:p-8 md:p-10">
              <div className="mb-6 text-center sm:mb-8">
                <h3 className="font-cursive text-gold mb-1 text-3xl sm:text-4xl">
                  Ankara Düğünü
                </h3>
                <p className="text-cream/70 text-sm sm:text-base">
                  11 Temmuz 2026 &middot; Cumartesi &middot; Beytepe Garden
                </p>
              </div>
              {ankaraTime ? (
                <CountdownRow time={ankaraTime} large />
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
      </div>
    </section>
  );
};

export default CountdownSection;
