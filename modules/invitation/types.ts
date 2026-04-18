import type { InvitationDefaults } from '@/modules/templates/types';

export type PublicInvitationView = {
  slug: string;
  partner1Name: string;
  partner2Name: string;
  dateTime: string;
  city: string;
  venueName?: string;
  addressText: string;
  template: InvitationDefaults;
};

/** Geri sayım bileşeni için satır modeli. */
export type CountdownDisplayEvent = {
  title: string;
  targetIso: string;
  subtitle?: string;
};

/** Etkinlik detayları kartı — konum alanları isteğe bağlı (şehir için ileride harita seçimi planlanıyor). */
export type EventDetailCard = {
  title: string;
  venueName?: string;
  addressText: string;
  city?: string;
};
