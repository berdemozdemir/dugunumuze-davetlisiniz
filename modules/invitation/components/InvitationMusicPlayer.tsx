'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_INVITATION_MUSIC_SRC, LOOP_EPS } from '../constants';

type Props = {
  /** Oynatılacak ses URL’si. Verilmezse `DEFAULT_INVITATION_MUSIC_SRC` kullanılır. */
  src?: string;
  /** Orijinal dosyaya göre başlangıç (sn). */
  trimStartSec?: number;
  /** Orijinal dosyaya göre bitiş (sn). Boş = dosya sonu. */
  trimEndSec?: number;
};

export function InvitationMusicPlayer({
  src = DEFAULT_INVITATION_MUSIC_SRC,
  trimStartSec,
  trimEndSec,
}: Props) {
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
    audio.loop = false;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;

    const start = trimStartSec ?? 0;

    const applyWindow = () => {
      const dur = audio.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const endRaw = trimEndSec !== undefined ? trimEndSec : dur;
      const end = Math.min(endRaw, dur);
      let s = Math.max(0, start);
      if (s >= end - LOOP_EPS) {
        s = Math.max(0, end - LOOP_EPS * 2);
      }
      if (audio.currentTime < s || audio.currentTime > end - LOOP_EPS) {
        audio.currentTime = s;
      }
    };

    const onTimeUpdate = () => {
      const dur = audio.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const endRaw = trimEndSec !== undefined ? trimEndSec : dur;
      const end = Math.min(endRaw, dur);
      const s = Math.max(0, trimStartSec ?? 0);
      if (s >= end - LOOP_EPS) return;
      if (audio.currentTime >= end - LOOP_EPS) {
        audio.currentTime = s;
      }
    };

    const tryPlay = () => {
      applyWindow();
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setNeedsInteraction(true));
    };

    audio.addEventListener('loadedmetadata', applyWindow);
    audio.addEventListener('timeupdate', onTimeUpdate);

    if (audio.readyState >= 3) tryPlay();
    else audio.addEventListener('canplaythrough', tryPlay, { once: true });

    const handleInteraction = () => {
      if (audioRef.current?.paused) {
        applyWindow();
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
      audio.removeEventListener('loadedmetadata', applyWindow);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [src, trimStartSec, trimEndSec]);

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
