import type { InvitationDefaults } from '@/modules/templates/types';
import {
  STORY_HEADLINE_DEFAULT,
  STORY_SUBLINE_DEFAULT,
} from '@/modules/invitation/constants';

/** Hikâye başlığı: boşsa varsayılan metin. */
export function resolveStoryHeadline(template: InvitationDefaults): string {
  const v = template.storyHeadline?.trim();
  if (v) return v;
  return STORY_HEADLINE_DEFAULT;
}

/** Hikâye alt metni: boşsa varsayılan metin. */
export function resolveStorySubline(template: InvitationDefaults): string {
  const v = template.storySubline?.trim();
  if (v) return v;
  return STORY_SUBLINE_DEFAULT;
}

/** Kapanış notu (boşsa `InvitationClosing` kendi varsayılanını kullanır). */
export function resolveClosingNote(template: InvitationDefaults): string {
  return template.closingNote?.trim() ?? '';
}

export function formatInvitationDateTimeLabel(iso: string) {
  const d = new Date(iso);

  const date = d.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const time = d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
}

export function formatInvitationYearFooter(iso: string) {
  const d = new Date(iso);

  return d.toLocaleDateString('tr-TR', {
    month: 'long',
    year: 'numeric',
  });
}
