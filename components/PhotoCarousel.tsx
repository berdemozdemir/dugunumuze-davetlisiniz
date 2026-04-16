'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export type PhotoCarouselItem = {
  src: string;
  alt: string;
};

const DEFAULT_INTERVAL = 4000;

type Props = {
  photos: PhotoCarouselItem[];
  interval?: number;
};

const PhotoCarousel = ({ photos, interval = DEFAULT_INTERVAL }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [active, setActive] = useState(0);
  const len = photos.length;

  const scrollTo = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el || len === 0) return;
      const safe = ((index % len) + len) % len;
      el.scrollTo({ left: safe * el.offsetWidth, behavior: 'smooth' });
    },
    [len],
  );

  const next = useCallback(() => {
    if (len === 0) return;
    setActive((prev) => {
      const nextIndex = (prev + 1) % len;
      scrollTo(nextIndex);
      return nextIndex;
    });
  }, [len, scrollTo]);

  const prev = useCallback(() => {
    if (len === 0) return;
    setActive((prev) => {
      const prevIndex = (prev - 1 + len) % len;
      scrollTo(prevIndex);
      return prevIndex;
    });
  }, [len, scrollTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (len <= 1) return;
    timerRef.current = setInterval(next, interval);
  }, [len, next, interval]);

  useEffect(() => {
    setActive((a) => (len === 0 ? 0 : Math.min(a, len - 1)));
  }, [len]);

  useEffect(() => {
    if (len === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [len, resetTimer]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || len === 0) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    const clamped = Math.max(0, Math.min(index, len - 1));
    setActive(clamped);
    resetTimer();
  }, [len, resetTimer]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || len === 0) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, len]);

  const handleArrow = (dir: 'prev' | 'next') => {
    if (len === 0) return;
    if (dir === 'prev') prev();
    else next();
    resetTimer();
  };

  if (len === 0) return null;

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
      <div className="group relative">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              className="w-full shrink-0 snap-center"
            >
              <div className="relative mx-auto h-72 w-56 sm:h-80 sm:w-64 md:h-96 md:w-72">
                <div className="border-gold/30 absolute -inset-3 rotate-3 rounded-2xl border" />
                <div className="border-gold/15 absolute -inset-3 -rotate-2 rounded-2xl border" />
                <div className="shadow-gold/10 ring-gold/20 relative h-full w-full overflow-hidden rounded-2xl shadow-2xl ring-2">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {len > 1 && (
          <>
            <button
              type="button"
              onClick={() => handleArrow('prev')}
              aria-label="Önceki fotoğraf"
              className="bg-deep/60 border-gold/30 text-gold hover:bg-deep/80 absolute top-1/2 left-0 flex h-9 w-9 -translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:-translate-x-3"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => handleArrow('next')}
              aria-label="Sonraki fotoğraf"
              className="bg-deep/60 border-gold/30 text-gold hover:bg-deep/80 absolute top-1/2 right-0 flex h-9 w-9 translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:translate-x-3"
            >
              ›
            </button>
          </>
        )}
      </div>

      {len > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {photos.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => {
                scrollTo(i);
                setActive(i);
                resetTimer();
              }}
              aria-label={`Fotoğraf ${i + 1}`}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                active === i ? 'bg-gold w-6' : 'bg-cream/20 hover:bg-cream/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoCarousel;
