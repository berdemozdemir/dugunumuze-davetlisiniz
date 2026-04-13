import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';

type Props = {
  partner1Name: string;
  partner2Name: string;
  quote: string;
  note: string;
  yearLabel: string;
};

// TODO: make this dynamic from the template.
const DEFAULT_QUOTE =
  'Her hikâyenin en güzel bölümü, birlikte yazılan kısmıdır.';

// TODO: make this dynamic from the template.
const DEFAULT_NOTE =
  'Hayatımızın en mutlu gününde sizi de aramızda görmek istiyoruz. Varlığınız en güzel hediyemiz olacak.';

export function InvitationClosing({
  partner1Name,
  partner2Name,
  quote,
  note,
  yearLabel,
}: Props) {
  const displayQuote = quote.trim() ? quote : DEFAULT_QUOTE;
  const displayNote = note.trim() ? note : DEFAULT_NOTE;

  return (
    <section className="relative px-4 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <RevealSection delay={200}>
          <div className="mt-10">
            <Ornament />
          </div>

          <blockquote className="font-display text-cream/80 mt-8 mb-6 text-xl leading-relaxed italic sm:text-2xl md:text-3xl">
            {/* TODO: make this dynamic from the template. */}
            &ldquo;{displayQuote}&rdquo;
          </blockquote>
        </RevealSection>

        <RevealSection delay={400}>
          <p className="text-cream/60 mx-auto max-w-lg text-sm leading-relaxed sm:text-base">
            {/* TODO: make this dynamic from the template. */}
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
