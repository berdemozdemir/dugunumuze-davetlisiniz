import { PublicInvitationView } from '../types';

export function countdownSubtitle(inv: PublicInvitationView) {
  const parts = [inv.venueName, inv.city].filter((s) => s?.trim());
  return parts.length ? parts.join(' · ') : inv.city;
}
