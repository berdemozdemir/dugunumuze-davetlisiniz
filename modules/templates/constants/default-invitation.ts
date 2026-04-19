import type { InvitationDefaults } from '../types';

/** Tek kaynak: DB’deki `event_templates.key` ile aynı olmalı. */
export const DEFAULT_EVENT_TEMPLATE_KEY = 'classic';

export const DEFAULT_EVENT_TEMPLATE_NAME = 'Klasik davetiye';

export const defaultInvitationTemplateDefaults: InvitationDefaults = {
  sections: {
    hero: true,
    countdown: true,
    story: true,
    details: true,
    closing: true,
    musicPlayer: true,
  },
  heroImageUri: '',
  quote: '',
  storyHeadline: '',
  storySubline: '',
  closingNote: '',
  closingPhotoUris: [],
  countdownEvents: [],
};
