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
  heroImagePublicSrc: '',
  quote: '',
  storyHeadline: '',
  storySubline: '',
  storyImageUri: '',
  storyImagePublicSrc: '',
  closingNote: '',
  closingPhotoUris: [],
  countdownEvent: {
    title: 'Etkinlik',
    dateTime: new Date().toISOString(),
    subtitle: '',
    venueName: '',
    addressText: '',
    city: '',
  },
};
