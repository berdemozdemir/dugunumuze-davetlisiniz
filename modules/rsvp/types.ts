import type { InvitationDefaults } from '@/modules/templates/types';

/** DB’de saklanan yan misafir satırı. */
export type RsvpCompanionStored = {
  fullName: string;
  phone?: string | null;
};

/** Dialog içi form state’i (yan misafir). */
export type RsvpCompanionField = {
  fullName: string;
  phone: string;
};

export type RsvpClosedReason =
  | 'disabled'
  | 'deadline'
  | 'capacity'
  | 'not-published'
  /** Bölüm açık ama çift son başvuru tarihini kaydetmemiş. */
  | 'no-deadline';

export type RsvpPublicState = {
  enabled: boolean;
  closedReason: RsvpClosedReason | null;
  canSubmit: boolean;
  deadlineIso: string | null;
  maxTotalGuests: number | null;
  reservedTotal: number;
  finalEventTitle: string;
  finalEventIso: string;
  buttonLabel: string;
  /** Son tarih için üst sınır (son etkinlik − 2 saat), ISO */
  deadlineMaxIso: string;
};

/**
 * Yayınlanmış davetiye için `events` satırından okunan alanlar
 * (`loadPublishedInvitationBySlug` çıktısı).
 */
export type PublishedInvitationEventRow = {
  id: string;
  slug: string;
  partner1Name: string;
  partner2Name: string;
  dateTime: Date;
  city: string;
  venueName: string | null;
  addressText: string;
  publishedAt: Date;
};

/** Dashboard RSVP özet satırı (`getOwnerSummary`). */
export type RsvpOwnerSummary = {
  rsvpDeadlineIso: string;
  rsvpMaxTotalGuests: number | null;
  rsvpButtonLabel: string;
  reservedTotal: number;
  deadlineMaxIso: string;
  finalEventTitle: string;
  finalEventIso: string;
};
