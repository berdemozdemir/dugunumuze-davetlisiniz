"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MusicPlayer = () => {
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
    const audio = new Audio("/music/cihat-askin-kelebek.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audioRef.current = audio;

    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setNeedsInteraction(true);
        });
    };

    if (audio.readyState >= 3) {
      tryPlay();
    } else {
      audio.addEventListener("canplaythrough", tryPlay, { once: true });
    }

    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            setNeedsInteraction(false);
          })
          .catch(() => {});
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

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
      onClick={toggle}
      aria-label={playing ? "Müziği kapat" : "Müziği aç"}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer ${
        playing
          ? "bg-gold/20 border-gold/40 shadow-lg shadow-gold/20"
          : "bg-white/10 border-white/20"
      } ${needsInteraction ? "animate-bounce-soft" : ""}`}
    >
      {playing ? (
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="flex items-end gap-[3px] h-4">
            <span className="w-[3px] bg-gold rounded-full animate-music-bar-1" />
            <span className="w-[3px] bg-gold rounded-full animate-music-bar-2" />
            <span className="w-[3px] bg-gold rounded-full animate-music-bar-3" />
            <span className="w-[3px] bg-gold rounded-full animate-music-bar-4" />
          </div>
          <span className="absolute flex items-center justify-center text-gold text-lg">
            ♫
          </span>
        </div>
      ) : (
        <span className="text-cream/70 text-lg">♪</span>
      )}
    </button>
  );
};

export default MusicPlayer;
