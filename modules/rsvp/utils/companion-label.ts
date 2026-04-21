import { RsvpCompanionStored } from '../types';

export function companionLabel(c: RsvpCompanionStored) {
  const name = c.fullName?.trim() || 'İsimsiz';
  const phone = c.phone?.trim();
  return phone ? `${name} · ${phone}` : name;
}
