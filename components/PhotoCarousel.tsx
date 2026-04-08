'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const PHOTOS = [
  { src: '/images/nisan-2.jpeg', alt: 'Elif & Erdem - Nişan' },
  { src: '/images/nisan-4.jpeg', alt: 'Elif & Erdem - Nişan Yürüyüşü' },
  { src: '/images/nisan-5.jpeg', alt: 'Elif & Erdem - Nişan Girişi' },
  { src: '/images/nisan-3.jpeg', alt: 'Elif & Erdem - Nişan Töreni' },
];

const AUTO_INTERVAL = 4000;

const PhotoCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: 'smooth' });
  }, []);

  const next = useCallback(() => {
    setActive((prev) => {
      const nextIndex = (prev + 1) % PHOTOS.length;
      scrollTo(nextIndex);
      return nextIndex;
    });
  }, [scrollTo]);

  const prev = useCallback(() => {
    setActive((prev) => {
      const prevIndex = (prev - 1 + PHOTOS.length) % PHOTOS.length;
      scrollTo(prevIndex);
      return prevIndex;
    });
  }, [scrollTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_INTERVAL);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActive(index);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleArrow = (dir: 'prev' | 'next') => {
    if (dir === 'prev') prev();
    else next();
    resetTimer();
  };

  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg">
      <div className="group relative">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PHOTOS.map((photo, i) => (
            <div key={i} className="w-full shrink-0 snap-center">
              <div className="relative mx-auto h-72 w-56 sm:h-80 sm:w-64 md:h-96 md:w-72">
                <div className="border-gold/30 absolute -inset-3 rotate-3 rounded-2xl border" />
                <div className="border-gold/15 absolute -inset-3 -rotate-2 rounded-2xl border" />
                <div className="shadow-gold/10 ring-gold/20 relative h-full w-full overflow-hidden rounded-2xl shadow-2xl ring-2">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleArrow('prev')}
          aria-label="Önceki fotoğraf"
          className="bg-deep/60 border-gold/30 text-gold hover:bg-deep/80 absolute top-1/2 left-0 flex h-9 w-9 -translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:-translate-x-3"
        >
          ‹
        </button>
        <button
          onClick={() => handleArrow('next')}
          aria-label="Sonraki fotoğraf"
          className="bg-deep/60 border-gold/30 text-gold hover:bg-deep/80 absolute top-1/2 right-0 flex h-9 w-9 translate-x-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:translate-x-3"
        >
          ›
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {PHOTOS.map((_, i) => (
          <button
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
    </div>
  );
};

export default PhotoCarousel;
