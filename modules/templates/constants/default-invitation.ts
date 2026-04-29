import type { InvitationDefaults } from '../types';

export const defaultInvitationTemplateDefaults: InvitationDefaults = {
  sections: {
    hero: true,
    countdown: true,
    story: true,
    details: true,
    closing: true,
    musicPlayer: true,
    rezervation: false,
  },
  heroImageUri: '',
  quote: '',
  storyHeadline: '',
  storySubline: '',
  storyImageUri: '',
  closingNote: '',
  closingPhotoUris: [],
  countdownEvents: [],
};
