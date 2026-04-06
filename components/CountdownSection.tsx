"use client";

import { useState, useEffect } from "react";
import { TimeLeft } from "@/lib/types";
import { calculateTimeLeft } from "@/lib/util";
import { ANKARA_DATE, ELAZIG_DATE } from "@/lib/constants";
import RevealSection from "./RevealSection";
import Ornament from "./Ornament";
import CountdownRow from "./CountdownRow";

const SKELETON_LARGE = [0, 1, 2, 3] as const;

const CountdownSection = () => {
  const [elazigTime, setElazigTime] = useState<TimeLeft | null>(null);
  const [ankaraTime, setAnkaraTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => {
      setElazigTime(calculateTimeLeft(ELAZIG_DATE));
      setAnkaraTime(calculateTimeLeft(ANKARA_DATE));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-20 sm:py-28 px-4">
      <div className="absolute inset-0 bg-linear-to-b from-deep via-deep-light to-deep" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <RevealSection className="text-center mb-16">
          <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl gold-shimmer-text mb-3">
            Düğünümüze Kalan Süre
          </h2>
          <div className="mt-4">
            <Ornament />
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="relative rounded-3xl p-6 sm:p-8 md:p-10 mb-10 bg-linear-to-br from-gold/10 via-transparent to-burgundy/10 border border-gold/30 animate-pulse-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-deep text-xs font-bold px-4 py-1 rounded-full tracking-wider uppercase">
              Ana Düğün
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="font-cursive text-3xl sm:text-4xl text-gold mb-1">
                Ankara
              </h3>
              <p className="text-cream/70 text-sm sm:text-base">
                11 Temmuz 2026 &middot; Cumartesi &middot; Beytepe Garden
              </p>
            </div>
            {ankaraTime ? (
              <CountdownRow time={ankaraTime} large />
            ) : (
              <div className="flex justify-center gap-4 sm:gap-6">
                {SKELETON_LARGE.map((i) => (
                  <div
                    key={i}
                    className="countdown-digit w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl animate-pulse bg-white/5"
                  />
                ))}
              </div>
            )}
          </div>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="rounded-2xl p-5 sm:p-6 md:p-8 bg-white/3 border border-white/10">
            <div className="text-center mb-5 sm:mb-6">
              <h3 className="font-cursive text-2xl sm:text-3xl text-gold/80 mb-1">
                Elazığ
              </h3>
              <p className="text-cream/50 text-xs sm:text-sm">
                4 Temmuz 2026 &middot; Cumartesi &middot; İlk Düğünümüz
              </p>
            </div>
            {elazigTime ? (
              <CountdownRow time={elazigTime} />
            ) : (
              <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                {SKELETON_LARGE.map((i) => (
                  <div
                    key={i}
                    className="countdown-digit w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl animate-pulse bg-white/5"
                  />
                ))}
              </div>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default CountdownSection;
