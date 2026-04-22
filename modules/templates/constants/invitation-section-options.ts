import type { InvitationDefaults } from '../types';

export const INVITATION_SECTION_OPTIONS = [
  {
    key: 'hero',
    label: 'Kapak',
    description: 'Kapak bölümü: isimler ve ilk izlenim alanı.',
  },
  {
    key: 'countdown',
    label: 'Geri sayım',
    description:
      'Etkinlik tarihlerine kalan süre; etkinlik listesiyle aynı kaynaktan gelir.',
  },
  {
    key: 'story',
    label: 'Hikâye',
    description: 'Hikâye akışı: tanışma, kısa anlatım ve benzeri içerikler.',
  },
  {
    key: 'details',
    label: 'Etkinlik detayları',
    description:
      'Mekân ve adres kartları; etkinlik listesiyle aynı kaynaktan gelir.',
  },
  {
    key: 'closing',
    label: 'Kapanış',
    description: 'Kapanış mesajı: teşekkür, son notlar.',
  },
  {
    key: 'musicPlayer',
    label: 'Müzik çalar',
    description: 'Sayfada müzik çaların görünürlüğü.',
  },
  {
    key: 'rezervation',
    label: 'Rezervasyon',
    description:
      'Rezervasyon butonu ve formu; son etkinlik için katılım bildirimi.',
  },
] as const satisfies ReadonlyArray<{
  key: keyof NonNullable<InvitationDefaults['sections']>;
  label: string;
  description: string;
}>;
