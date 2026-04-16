'use client';

import { useEffect, useState } from 'react';
import type { TimeLeft } from '@/lib/types';
import { calculateTimeLeft } from '@/lib/utils';
import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import CountdownRow from '@/components/CountdownRow';

const SKELETON = [0, 1, 2, 3] as const;

export type InvitationCountdownEvent = {
  title: string;
  targetIso: string;
  subtitle?: string;
};

type Props = {
  events: InvitationCountdownEvent[];
};

const headingTone = (index: number, total: number) => {
  if (total === 1) return 'text-gold';
  if (index === total - 1) return 'text-gold';
  if (index % 2 === 0) return 'text-rose';
  return 'text-gold/80';
};

export function InvitationCountdown({ events }: Props) {
  const [times, setTimes] = useState<(TimeLeft | null)[]>(() =>
    events.map(() => null),
  );

  useEffect(() => {
    const targets = events.map((e) => new Date(e.targetIso));
    const tick = () => {
      setTimes(targets.map((t) => calculateTimeLeft(t)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [events]);

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

        <div className="space-y-6">
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            const delay = 200 + index * 100;
            const time = times[index];
            const titleClass = headingTone(index, events.length);
            const h3Size = isLast
              ? 'text-3xl sm:text-4xl'
              : 'text-2xl sm:text-3xl';

            return (
              <RevealSection key={`${event.targetIso}-${index}`} delay={delay}>
                {isLast ? (
                  <div className="border-gold/30 from-gold/10 to-burgundy/10 animate-pulse-glow relative rounded-3xl border bg-linear-to-br via-transparent p-6 sm:p-8 md:p-10">
                    <div className="mb-6 text-center sm:mb-8">
                      <h3
                        className={`font-cursive mb-1 ${titleClass} ${h3Size}`}
                      >
                        {event.title}
                      </h3>
                      {event.subtitle ? (
                        <p className="text-cream/70 text-sm sm:text-base">
                          {event.subtitle}
                        </p>
                      ) : null}
                    </div>
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
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6 md:p-8">
                    <div className="mb-5 text-center sm:mb-6">
                      <h3
                        className={`font-cursive mb-1 ${titleClass} ${h3Size}`}
                      >
                        {event.title}
                      </h3>
                      {event.subtitle ? (
                        <p className="text-cream/50 text-xs sm:text-sm">
                          {event.subtitle}
                        </p>
                      ) : null}
                    </div>
                    {time ? (
                      <CountdownRow time={time} />
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
                )}
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
