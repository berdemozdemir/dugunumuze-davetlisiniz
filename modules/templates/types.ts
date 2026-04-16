export type TemplateKey = string;

// davetiye sayfasındaki blokların aç/kapa haritası (hero/countdown/story/details/closing/musicPlayer).
export type InvitationSections = {
  hero?: boolean;
  countdown?: boolean;
  story?: boolean;
  details?: boolean;
  closing?: boolean;
  musicPlayer?: boolean;
};

/** Countdown bölümündeki tek etkinlik satırı (ISO 8601 `dateTime`). */
export type CountdownEventConfig = {
  title: string;
  dateTime: string;
  subtitle?: string;
};

// şablondan gelen varsayılan davetiye ayarları (sections + opsiyonel metinler).
export type InvitationDefaults = {
  sections?: InvitationSections;
  /** Supabase Storage object path (bucket: `digital-invitation-images`). Example: `weddings/<id>/hero-<ts>.webp` */
  heroImageUri?: string;
  quote?: string;
  storyHeadline?: string;
  storySubline?: string;
  closingNote?: string;
  /** Closing section carousel; storage object paths, max 10. */
  closingPhotoUris?: string[];
  /** Countdown kartları; en fazla `COUNTDOWN_EVENTS_MAX` (invitation constants). */
  countdownEvents?: CountdownEventConfig[];
};

// wedding’e özel üstüne yazılanlar
export type InvitationOverrides = InvitationDefaults;

// public sayfaya vereceğimiz “birleşik sonuç” modeli (wedding çekirdek bilgiler + merge edilmiş template).
export type InvitationViewModel = {
  slug: string;
  partner1Name: string;
  partner2Name: string;
  dateTime: string;
  city: string;
  venueName?: string;
  addressText: string;
  publishedAt?: string;

  template: InvitationDefaults;
};
