import type { RsvpClosedReason } from '@/modules/rsvp/types';

/** Misafir arayüzünde kapalı / bloklu durum için kısa açıklama. */
export function rsvpGuestClosedMessage(
  reason: RsvpClosedReason | null,
): string | null {
  if (reason === null) return null;

  switch (reason) {
    case 'deadline':
      return 'Son başvuru tarihi geçti.';
    case 'capacity':
      return 'Kontenjan doldu.';
    case 'no-deadline':
      return 'Rezervasyon henüz yapılandırılmadı.';
    case 'disabled':
      return 'Rezervasyon kapalı.';
    case 'not-published':
      return null;
    default:
      return null;
  }
}
