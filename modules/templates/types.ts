// davetiye sayfasındaki blokların aç/kapa haritası (hero/countdown/story/details/closing/musicPlayer).
export type InvitationSections = {
  hero?: boolean;
  countdown?: boolean;
  story?: boolean;
  details?: boolean;
  closing?: boolean;
  musicPlayer?: boolean;
};

/**
 * Tek etkinlik: geri sayım + etkinlik detayları aynı kayıttan beslenir.
 * ISO 8601 `dateTime`; konum alanları detay kartında kullanılır.
 */
export type CountdownEventConfig = {
  title: string;
  dateTime: string;
  subtitle?: string;
  venueName?: string;
  /** TODO: İsteğe bağlı; ileride harita seçimi. */
  addressText?: string;
  city?: string;
};

// şablondan gelen varsayılan davetiye ayarları (sections + opsiyonel metinler).
export type InvitationDefaults = {
  sections?: InvitationSections;
  /** Supabase Storage object path (bucket: `digital-invitation-images`). Example: `events/<id>/hero-<ts>.webp` */
  heroImageUri?: string;
  /** Kapak üst satırı (kısa davet cümlesi); boşsa `HERO_EYEBROW_DEFAULT`. */
  heroEyebrow?: string;
  /**
   * Kapaktaki tarih/saat satırı; boşsa `events.date_time` (çekirdek kayıt) üzerinden biçimlendirilir.
   * (Şema: makul uzunluk üst sınırı.)
   */
  heroDateLine?: string;
  /** Kapakta isimlerin altındaki italik satır; boşsa `HERO_TAGLINE_DEFAULT`. */
  heroTagline?: string;
  quote?: string;
  storyHeadline?: string;
  storySubline?: string;
  closingNote?: string;
  /** Closing section carousel; storage object paths, max 10. */
  closingPhotoUris?: string[];
  /** Countdown kartları; en fazla `COUNTDOWN_EVENTS_MAX` (invitation constants). */
  countdownEvents?: CountdownEventConfig[];
  /**
   * Supabase Storage object path (bucket: `digital-invitation-audio`).
   * Kesme sadece oynatma sırasında `musicTrimStartSec` / `musicTrimEndSec` ile uygulanır.
   */
  musicTrackPath?: string;
  /** Oynatma penceresi başlangıcı (saniye). */
  musicTrimStartSec?: number;
  /** Oynatma penceresi sonu (saniye); tanımlıysa başlangıçtan büyük olmalı. */
  musicTrimEndSec?: number;
};

// şablona göre etkinliğe özel üstüne yazılanlar
export type InvitationOverrides = InvitationDefaults;
