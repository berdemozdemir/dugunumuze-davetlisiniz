import type { InvitationDefaults } from '../types';

/** Tek kaynak: DB’deki `wedding_templates.key` ile aynı olmalı. */
export const DEFAULT_WEDDING_TEMPLATE_KEY = 'classic';

export const DEFAULT_WEDDING_TEMPLATE_NAME = 'Klasik davetiye';

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
