'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_SRC = '/music/cihat-askin-kelebek.mp3';

type Props = {
  src?: string;
};

export function InvitationMusicPlayer({ src = DEFAULT_SRC }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        setPlaying(true);
        setNeedsInteraction(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;

    const tryPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setNeedsInteraction(true));
    };

    if (audio.readyState >= 3) tryPlay();
    else audio.addEventListener('canplaythrough', tryPlay, { once: true });

    const handleInteraction = () => {
      if (audioRef.current?.paused) {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            setNeedsInteraction(false);
          })
          .catch(() => {});
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      play();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Müziği kapat' : 'Müziği aç'}
      // TODO: dont use this syntax in here
      className={`border-gold/40 bg-gold/20 shadow-gold/20 fixed right-6 bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${
        playing ? '' : 'border-white/20 bg-white/10 shadow-none'
      } ${needsInteraction ? 'animate-bounce-soft' : ''}`}
    >
      {playing ? (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="flex h-4 items-end gap-[3px]">
            <span className="animate-music-bar-1 bg-gold h-4 w-[3px] rounded-full" />
            <span className="animate-music-bar-2 bg-gold h-4 w-[3px] rounded-full" />
            <span className="animate-music-bar-3 bg-gold h-4 w-[3px] rounded-full" />
            <span className="animate-music-bar-4 bg-gold h-4 w-[3px] rounded-full" />
          </div>
          <span className="text-gold absolute flex items-center justify-center text-lg">
            ♫
          </span>
        </div>
      ) : (
        <span className="text-cream/70 text-lg">♪</span>
      )}
    </button>
  );
}
