import type { PhotoCarouselItem } from '@/components/PhotoCarousel';
import type { InvitationDefaults } from '@/modules/templates/types';
import { getPublicInvitationImageUrl } from '@/lib/supabase/public-image-url';
import {
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
} from '@/modules/invitation/constants';

/** Hikâye başlığı: boşsa varsayılan metin. */
export function resolveStoryHeadline(template: InvitationDefaults): string {
  const v = template.storyHeadline?.trim();
  if (v) return v;
  return STORY_HEADLINE_DEFAULT;
}

/** Hikâye alt metni: boşsa varsayılan metin. */
export function resolveStorySubline(template: InvitationDefaults): string {
  const v = template.storySubline?.trim();
  if (v) return v;
  return STORY_SUBLINE_DEFAULT;
}

/** Kapanış notu (boşsa `InvitationClosing` kendi varsayılanını kullanır). */
export function resolveClosingNote(template: InvitationDefaults): string {
  return template.closingNote?.trim() ?? '';
}

const CLOSING_CAROUSEL_RENDER = {
  render: true as const,
  width: 1200,
  quality: 85,
};

/**
 * Şablondaki storage path’lerini public `next/image` src + erişilebilir alt metne çevirir.
 * Geçersiz / boş URL’ler elenir.
 */
export function buildClosingCarouselPhotos(
  photoUris: string[],
  partner1Name: string,
  partner2Name: string,
): PhotoCarouselItem[] {
  return photoUris
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 10)
    .map((path, i) => {
      const src = getPublicInvitationImageUrl(path, CLOSING_CAROUSEL_RENDER);
      return {
        src,
        alt: `${partner1Name} & ${partner2Name} — ${i + 1}`,
      };
    })
    .filter((p) => p.src.length > 0);
}

export function formatInvitationDateTimeLabel(iso: string) {
  const d = new Date(iso);

  const date = d.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export function formatInvitationYearFooter(iso: string) {
  const d = new Date(iso);

  return d.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  });
}

export function normalizeTrim(n: number | undefined): number | undefined {
  if (n === undefined || Number.isNaN(n)) return undefined;
  return n;
}

/** Trim alanlarını bilinen dosya süresine göre sınırlar (0…maxSec). */
export function clampTrimSecondsToDuration(
  value: number | undefined,
  maxSec: number,
): number | undefined {
  const v = normalizeTrim(value);
  if (v === undefined) return undefined;
  if (!Number.isFinite(maxSec) || maxSec <= 0) return v;
  return Math.min(Math.max(0, v), maxSec);
}

/** Örn. 185.3 → `3:05` (gösterim için). */
export function formatAudioDurationMmSs(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const totalSec = Math.floor(seconds);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
