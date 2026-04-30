import Image from 'next/image';
import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import { getPublicInvitationImageUrl } from '@/lib/supabase/public-image-url';

type Props = {
  headline: string;
  subline: string;
  /** Supabase Storage object path (`digital-invitation-images` bucket). */
  storyImageUri?: string;
  /** Static public `/public` image path fallback (template default). */
  storyImagePublicSrc?: string;
};

const STORY_IMAGE_FALLBACK = '/images/wedding/story-section-bg-image.jpeg';

export function InvitationStory({
  headline,
  subline,
  storyImageUri,
  storyImagePublicSrc,
}: Props) {
  const dynamicSrc = storyImageUri
    ? getPublicInvitationImageUrl(storyImageUri, {
        render: true,
        width: 2200,
        quality: 85,
      })
    : null;

  const fallbackSrc = storyImagePublicSrc?.trim() || STORY_IMAGE_FALLBACK;

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden sm:min-h-[70vh]">
      <div className="absolute inset-0">
        <Image
          src={dynamicSrc || fallbackSrc}
          alt="Davetiye hikâye arka planı"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority={false}
        />

        <div
          aria-hidden
          className="from-deep/60 via-deep/40 to-deep/70 absolute inset-0 bg-linear-to-b"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <RevealSection>
          <Ornament />

          <p className="font-cursive gold-gradient-text mt-6 mb-4 text-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl md:text-6xl">
            {headline}
          </p>

          <p className="text-cream/90 text-sm tracking-wider drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-base">
            {subline}
          </p>

          <div className="mt-6">
            <Ornament />
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
