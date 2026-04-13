import type { InvitationDefaults } from '../types';

export const INVITATION_SECTION_OPTIONS = [
  {
    key: 'hero',
    label: 'Hero',
    description: 'Kapak bölümü: isimler ve ilk izlenim alanı.',
  },
  {
    key: 'countdown',
    label: 'Countdown',
    description: 'Düğün tarihine kalan süre sayacı.',
  },
  {
    key: 'story',
    label: 'Story',
    description: 'Hikaye/akış: tanışma, kısa anlatım ve benzeri içerikler.',
  },
  {
    key: 'details',
    label: 'Details',
    description: 'Konum, saat, program ve diğer etkinlik detayları.',
  },
  {
    key: 'closing',
    label: 'Closing',
    description: 'Kapanış mesajı: teşekkür, son notlar.',
  },
  {
    key: 'musicPlayer',
    label: 'Music player',
    description: 'Sayfada müzik çaların görünürlüğü.',
  },
] as const satisfies ReadonlyArray<{
  key: keyof NonNullable<InvitationDefaults['sections']>;
  label: string;
  description: string;
}>;

