"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const PHOTOS = [
  { src: "/images/nisan-2.jpeg", alt: "Elif & Erdem - Nişan" },
  { src: "/images/nisan-4.jpeg", alt: "Elif & Erdem - Nişan Yürüyüşü" },
  { src: "/images/nisan-5.jpeg", alt: "Elif & Erdem - Nişan Girişi" },
  { src: "/images/nisan-3.jpeg", alt: "Elif & Erdem - Nişan Töreni" },
];

const AUTO_INTERVAL = 4000;

const PhotoCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
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
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleArrow = (dir: "prev" | "next") => {
    if (dir === "prev") prev();
    else next();
    resetTimer();
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 py-6 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PHOTOS.map((photo, i) => (
            <div key={i} className="snap-center shrink-0 w-full">
              <div className="relative mx-auto w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96">
                <div className="absolute -inset-3 rounded-2xl border border-gold/30 rotate-3" />
                <div className="absolute -inset-3 rounded-2xl border border-gold/15 -rotate-2" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 ring-2 ring-gold/20">
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
          onClick={() => handleArrow("prev")}
          aria-label="Önceki fotoğraf"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-3 w-9 h-9 rounded-full bg-deep/60 backdrop-blur-sm border border-gold/30 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-deep/80"
        >
          ‹
        </button>
        <button
          onClick={() => handleArrow("next")}
          aria-label="Sonraki fotoğraf"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-3 w-9 h-9 rounded-full bg-deep/60 backdrop-blur-sm border border-gold/30 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-deep/80"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              scrollTo(i);
              setActive(i);
              resetTimer();
            }}
            aria-label={`Fotoğraf ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              active === i
                ? "bg-gold w-6"
                : "bg-cream/20 hover:bg-cream/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
