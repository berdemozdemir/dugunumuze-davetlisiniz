'use client';

import { useEffect, useState } from 'react';
import type { TimeLeft } from '@/lib/types';
import { calculateTimeLeft, cn } from '@/lib/utils';
import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import CountdownRow from '@/components/CountdownRow';
import { COUNTDOWN_SKELETON_KEYS } from '@/modules/invitation/constants';
import { countdownHeadingClass } from '@/modules/invitation/util';
import type { CountdownDisplayEvent } from '@/modules/invitation/types';

export type { CountdownDisplayEvent as InvitationCountdownEvent } from '@/modules/invitation/types';

type Props = {
  events: CountdownDisplayEvent[];
};

type CountdownTimerProps = {
  time: TimeLeft | null;
  skeletonSize: 'large' | 'standard';
};

function CountdownTimerOrSkeleton({ time, skeletonSize }: CountdownTimerProps) {
  if (time) {
    const large = skeletonSize === 'large';
    return <CountdownRow time={time} large={large} />;
  }

  if (skeletonSize === 'large') {
    return (
      <div className="flex justify-center gap-4 sm:gap-6">
        {COUNTDOWN_SKELETON_KEYS.map((i) => (
          <div
            key={i}
            className="countdown-digit h-18 w-18 animate-pulse rounded-xl bg-white/5 sm:h-24 sm:w-24 md:h-28 md:w-28"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
      {COUNTDOWN_SKELETON_KEYS.map((i) => (
        <div
          key={i}
          className="countdown-digit h-14 w-14 animate-pulse rounded-xl bg-white/5 sm:h-16 sm:w-16 md:h-20 md:w-20"
        />
      ))}
    </div>
  );
}

type EventHeaderProps = {
  title: string;
  titleClass: string;
  headingSizeClass: string;
  subtitle?: string;
  subtitleTone: 'emphasized' | 'muted';
};

function EventHeader({
  title,
  titleClass,
  headingSizeClass,
  subtitle,
  subtitleTone,
}: EventHeaderProps) {
  const subtitleClassName =
    subtitleTone === 'emphasized'
      ? 'text-cream/70 text-sm sm:text-base'
      : 'text-cream/50 text-xs sm:text-sm';

  return (
    <div
      className={
        subtitleTone === 'emphasized'
          ? 'mb-6 text-center sm:mb-8'
          : 'mb-5 text-center sm:mb-6'
      }
    >
      <h3 className={cn('font-cursive mb-1', titleClass, headingSizeClass)}>
        {title}
      </h3>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
}

type LastEventBlockProps = {
  event: CountdownDisplayEvent;
  titleClass: string;
  headingSizeClass: string;
  time: TimeLeft | null;
};

function LastEventBlock({
  event,
  titleClass,
  headingSizeClass,
  time,
}: LastEventBlockProps) {
  return (
    <div className="border-gold/30 from-gold/10 to-burgundy/10 animate-pulse-glow relative rounded-3xl border bg-linear-to-br via-transparent p-6 sm:p-8 md:p-10">
      <EventHeader
        title={event.title}
        titleClass={titleClass}
        headingSizeClass={headingSizeClass}
        subtitle={event.subtitle}
        subtitleTone="emphasized"
      />
      <CountdownTimerOrSkeleton time={time} skeletonSize="large" />
    </div>
  );
}

type StandardEventBlockProps = {
  event: CountdownDisplayEvent;
  titleClass: string;
  headingSizeClass: string;
  time: TimeLeft | null;
};

function StandardEventBlock({
  event,
  titleClass,
  headingSizeClass,
  time,
}: StandardEventBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6 md:p-8">
      <EventHeader
        title={event.title}
        titleClass={titleClass}
        headingSizeClass={headingSizeClass}
        subtitle={event.subtitle}
        subtitleTone="muted"
      />
      <CountdownTimerOrSkeleton time={time} skeletonSize="standard" />
    </div>
  );
}

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
            Kalan Süre
          </h2>

          <div className="mt-4">
            <Ornament />
          </div>
        </RevealSection>

        <div className="space-y-6">
          {events.map((event, index) => {
            const isLastEvent = index === events.length - 1;
            const delayMs = 200 + index * 100;
            const time = times[index];
            const titleClass = countdownHeadingClass(index, events.length);
            const headingSizeClass = isLastEvent
              ? 'text-3xl sm:text-4xl'
              : 'text-2xl sm:text-3xl';

            return (
              <RevealSection key={`${event.targetIso}-${index}`} delay={delayMs}>
                {isLastEvent && (
                  <LastEventBlock
                    event={event}
                    titleClass={titleClass}
                    headingSizeClass={headingSizeClass}
                    time={time}
                  />
                )}

                {!isLastEvent && (
                  <StandardEventBlock
                    event={event}
                    titleClass={titleClass}
                    headingSizeClass={headingSizeClass}
                    time={time}
                  />
                )}
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
