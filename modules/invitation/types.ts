import type { InvitationDefaults } from '@/modules/templates/types';

export type PublicInvitationView = {
  slug: string;
  partner1Name: string;
  partner2Name: string;
  dateTime: string;
  city: string;
  venueName?: string;
  addressText: string;
  template: InvitationDefaults;
};
