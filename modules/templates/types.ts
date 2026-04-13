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

// şablondan gelen varsayılan davetiye ayarları (sections + opsiyonel metinler).
export type InvitationDefaults = {
  sections?: InvitationSections;
  quote?: string;
  storyHeadline?: string;
  storySubline?: string;
  closingNote?: string;
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
