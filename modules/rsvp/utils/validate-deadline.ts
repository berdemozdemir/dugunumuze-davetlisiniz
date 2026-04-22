import { RSVP_FINAL_EVENT_BUFFER_MS } from '@/modules/rsvp/constants';
import { resolveFinalEventForRezervation } from '@/modules/rsvp/utils/resolve-final-event';
import type { CountdownEventConfig } from '@/modules/templates/types';

/** `deadline` son etkinlikten en az 2 saat önce mi? */
export function isRsvpDeadlineWithinBuffer(
  events: CountdownEventConfig[],
  core: { dateTimeIso: string; venueName?: string | null; city: string },
  deadlineMs: number,
): boolean {
  const final = resolveFinalEventForRezervation(events, core);
  const max = final.dateTime.getTime() - RSVP_FINAL_EVENT_BUFFER_MS;
  return deadlineMs <= max;
}
