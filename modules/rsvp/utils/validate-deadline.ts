import { RSVP_FINAL_EVENT_BUFFER_MS } from '@/modules/rsvp/constants';
import type { CountdownEventConfig } from '@/modules/templates/types';

/** `deadline` son etkinlikten en az 2 saat önce mi? */
export function isRsvpDeadlineWithinBuffer(
  countdownEvent: CountdownEventConfig,
  deadlineMs: number,
): boolean {
  const eventMs = Date.parse(countdownEvent.dateTime);
  if (Number.isNaN(eventMs)) return true;
  const max = eventMs - RSVP_FINAL_EVENT_BUFFER_MS;
  return deadlineMs <= max;
}
