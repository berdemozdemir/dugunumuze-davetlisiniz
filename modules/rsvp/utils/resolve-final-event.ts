import { normalizeCountdownEventsFromTemplate } from '@/modules/invitation/util';
import type { CountdownEventConfig } from '@/modules/templates/types';

export type FinalEventResolution = {
  title: string;
  dateTime: Date;
};

/**
 * Kronolojik olarak en geç program öğesi; liste boşsa çekirdek etkinlik kullanılır.
 */
export function resolveFinalEventForRsvp(
  countdownEvents: CountdownEventConfig[] | undefined,
  core: {
    dateTimeIso: string;
    venueName?: string | null;
    city: string;
  },
): FinalEventResolution {
  const list = normalizeCountdownEventsFromTemplate(countdownEvents);
  if (list.length === 0) {
    const title =
      core.venueName?.trim() || core.city?.trim() || 'Etkinlik';
    return {
      title,
      dateTime: new Date(core.dateTimeIso),
    };
  }

  const latest = list.reduce((a, b) =>
    Date.parse(a.dateTime) >= Date.parse(b.dateTime) ? a : b,
  );

  return {
    title: latest.title.trim(),
    dateTime: new Date(latest.dateTime),
  };
}
