import { redirect } from 'next/navigation';
import { orpc_getInvitationBySlug } from '@/modules/templates/actions/get-invitation-by-slug';
import { orpc_weddings_getInvitationPreviewBySlug } from '@/modules/weddings/actions/get-invitation-preview-by-slug';
import { paths } from '@/lib/paths';
import SectionDivider from '@/components/SectionDivider';
import { isInvitationSectionVisible } from '@/modules/invitation/section-visibility';
import { InvitationHero } from '@/modules/invitation/components/InvitationHero';
import { InvitationCountdown } from '@/modules/invitation/components/InvitationCountdown';
import { InvitationStory } from '@/modules/invitation/components/InvitationStory';
import { InvitationDetails } from '@/modules/invitation/components/InvitationDetails';
import { InvitationClosing } from '@/modules/invitation/components/InvitationClosing';
import { InvitationMusicPlayer } from '@/modules/invitation/components/InvitationMusicPlayer';
import {
  formatInvitationDateTimeLabel,
  formatInvitationYearFooter,
} from '@/modules/invitation/util';
import type { PublicInvitationView } from '@/modules/invitation/types';
import { countdownSubtitle } from '@/modules/invitation/components/countdownSubtitle';

const STORY_HEADLINE_DEFAULT = 'Bir "Evet" ile Başladı';
const STORY_SUBLINE_DEFAULT = 'Şimdi sıra sonsuza dek "evet" demeye geldi';

export default async function PublicInvitationPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const { slug } = await params;

  const sp = searchParams ? await searchParams : {};
  const preview = sp.preview === '1' || sp.preview === 'true';

  const [invErr, data] = preview
    ? await orpc_weddings_getInvitationPreviewBySlug({ slug })
    : await orpc_getInvitationBySlug({ slug });

  if (invErr) {
    if (invErr.reason === 'not-published') {
      return (
        <main className="mx-auto max-w-3xl p-8">
          <h1 className="text-2xl font-semibold">Bu davetiye yayında değil</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Düğün sahibi davetiyeyi yayınladıktan sonra tekrar deneyin.
          </p>
        </main>
      );
    }

    redirect(paths.home);
  }

  const invitation = data.invitation as PublicInvitationView;
  const sections = invitation.template.sections;

  const dateLabel = formatInvitationDateTimeLabel(invitation.dateTime);
  const yearFooter = formatInvitationYearFooter(invitation.dateTime);

  const storyHeadline = STORY_HEADLINE_DEFAULT;
  const storySubline =
    invitation.template.shortNote?.trim() || STORY_SUBLINE_DEFAULT;

  const closingQuote = invitation.template.quote?.trim() ?? '';
  const closingNote = invitation.template.shortNote?.trim() ?? '';

  return (
    <main className="overflow-x-hidden">
      {isInvitationSectionVisible(sections, 'musicPlayer') && (
        <InvitationMusicPlayer />
      )}

      {isInvitationSectionVisible(sections, 'hero') && (
        <InvitationHero
          partner1Name={invitation.partner1Name}
          partner2Name={invitation.partner2Name}
          dateLabel={dateLabel}
        />
      )}

      {isInvitationSectionVisible(sections, 'countdown') && (
        <>
          <InvitationCountdown
            targetIso={invitation.dateTime}
            subtitle={countdownSubtitle(invitation)}
          />

          <SectionDivider />
        </>
      )}

      {isInvitationSectionVisible(sections, 'story') && (
        <>
          <InvitationStory headline={storyHeadline} subline={storySubline} />

          <SectionDivider />
        </>
      )}

      {isInvitationSectionVisible(sections, 'details') && (
        <>
          <InvitationDetails
            city={invitation.city}
            venueName={invitation.venueName}
            addressText={invitation.addressText}
          />

          <SectionDivider />
        </>
      )}

      {isInvitationSectionVisible(sections, 'closing') && (
        <InvitationClosing
          partner1Name={invitation.partner1Name}
          partner2Name={invitation.partner2Name}
          quote={closingQuote}
          note={closingNote}
          yearLabel={yearFooter}
        />
      )}

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-cream/30 text-xs tracking-wider">
          {invitation.partner1Name} &amp; {invitation.partner2Name} &middot;{' '}
          {new Date(invitation.dateTime).getFullYear()}
        </p>
      </footer>
    </main>
  );
}
