import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import {
  CLOSING_NOTE_DEFAULT,
  CLOSING_QUOTE_DEFAULT,
} from '@/modules/invitation/constants';

type Props = {
  partner1Name: string;
  partner2Name: string;
  quote: string;
  note: string;
  yearLabel: string;
};

export function InvitationClosing({
  partner1Name,
  partner2Name,
  quote,
  note,
  yearLabel,
}: Props) {
  const displayQuote = quote.trim() ? quote : CLOSING_QUOTE_DEFAULT;
  const displayNote = note.trim() ? note : CLOSING_NOTE_DEFAULT;

  return (
    <section className="relative px-4 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <RevealSection delay={200}>
          <div className="mt-10">
            <Ornament />
          </div>

          <blockquote className="font-display text-cream/80 mt-8 mb-6 text-xl leading-relaxed italic sm:text-2xl md:text-3xl">
            &ldquo;{displayQuote}&rdquo;
          </blockquote>
        </RevealSection>

        <RevealSection delay={400}>
          <p className="text-cream/60 mx-auto max-w-lg text-sm leading-relaxed sm:text-base">
            {displayNote}
          </p>
        </RevealSection>

        <RevealSection delay={600}>
          <div className="mt-12">
            <p className="font-cursive gold-gradient-text text-3xl sm:text-4xl">
              {partner1Name} &amp; {partner2Name}
            </p>

            <p className="text-cream/40 mt-4 text-xs tracking-widest uppercase">
              {yearLabel}
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
