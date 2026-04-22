import type { PhotoCarouselItem } from '@/components/PhotoCarousel';
import type {
  CountdownDisplayEvent,
  EventDetailCard,
} from '@/modules/invitation/types';
import type {
  CountdownEventConfig,
  InvitationDefaults,
} from '@/modules/templates/types';
import { getPublicInvitationImageUrl } from '@/lib/supabase/public-image-url';
import {
  HERO_EYEBROW_DEFAULT,
  HERO_TAGLINE_DEFAULT,
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
} from '@/modules/invitation/constants';

/** Kapak üst satırı: boşsa varsayılan metin. */
export function resolveHeroEyebrow(template: InvitationDefaults): string {
  const v = template.heroEyebrow?.trim();
  if (v) return v;
  return HERO_EYEBROW_DEFAULT;
}

/**
 * Kapak tarih/saat satırı: özelleştirilmiş metin yoksa düğün tarihinden üretilir.
 */
export function resolveHeroDateLabel(
  template: InvitationDefaults,
  dateTimeIso: string,
): string {
  const v = template.heroDateLine?.trim();
  if (v) return v;
  return formatInvitationDateTimeLabel(dateTimeIso);
}

/** Kapak italik vurgu (isimlerin altı): boşsa varsayılan metin. */
export function resolveHeroTagline(template: InvitationDefaults): string {
  const v = template.heroTagline?.trim();
  if (v) return v;
  return HERO_TAGLINE_DEFAULT;
}

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

/** `InvitationCountdown` görünüm tonları — index ve toplam sayıya göre. */
export function countdownHeadingClass(index: number, total: number): string {
  if (total === 1) return 'text-gold';
  if (index === total - 1) return 'text-gold';
  if (index % 2 === 0) return 'text-rose';
  return 'text-gold/80';
}

// --- Etkinlik listesi (geri sayım + detay kartları; tek şablondan) ---
function isValidCountdownEventRow(e: CountdownEventConfig): boolean {
  const titleOk = e.title.trim().length > 0;
  const dateOk = !Number.isNaN(Date.parse(e.dateTime));
  return titleOk && dateOk;
}

/** Şablondaki ham etkinlik listesini doğrular; sırayı korur. */
export function normalizeCountdownEventsFromTemplate(
  raw: CountdownEventConfig[] | undefined,
): CountdownEventConfig[] {
  if (!raw?.length) return [];
  return raw.filter(isValidCountdownEventRow);
}

export function toCountdownDisplayEvents(
  events: CountdownEventConfig[],
): CountdownDisplayEvent[] {
  return events.map((e) => ({
    title: e.title.trim(),
    targetIso: e.dateTime,
    subtitle: e.subtitle?.trim() || undefined,
  }));
}

export function toEventDetailCards(
  events: CountdownEventConfig[],
): EventDetailCard[] {
  return events.map((e) => ({
    title: e.title.trim(),
    venueName: e.venueName?.trim() || undefined,
    addressText: (e.addressText ?? '').trim(),
    city: e.city?.trim() || undefined,
  }));
}

/**
 * `events` çekirdek satırı için kaynak: doğrulanmış etkinlikler içinde takvimde en erken olan.
 */
export function selectPrimaryEventForEventRow(
  events: CountdownEventConfig[],
): CountdownEventConfig | null {
  if (events.length === 0) return null;
  return events.reduce((earliest, e) =>
    Date.parse(e.dateTime) > Date.parse(earliest.dateTime) ? e : earliest,
  );
}
