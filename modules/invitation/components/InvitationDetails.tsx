import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';

type Props = {
  city: string;
  venueName?: string;
  addressText: string;
};

// TODO: user should be able to add more than one event and details.
export function InvitationDetails({ city, venueName, addressText }: Props) {
  const mapsQuery = [venueName, addressText, city].filter(Boolean).join(' ');
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`;

  return (
    <section className="relative px-4 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-3xl">
        <RevealSection className="mb-16 text-center">
          <h2 className="font-cursive text-gold mb-3 text-4xl sm:text-5xl md:text-6xl">
            Etkinlik Detayları
          </h2>
          <div className="mt-4">
            <Ornament />
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="group border-gold/30 from-gold/10 to-burgundy/10 shadow-gold/5 hover:border-gold/50 hover:shadow-gold/15 relative rounded-2xl border-2 bg-linear-to-br via-transparent p-6 shadow-lg transition-all duration-500 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-gold/60 text-xs tracking-widest uppercase">
                Düğün
              </span>
            </div>
            <h3 className="font-cursive text-gold mb-4 text-3xl sm:text-4xl">
              {venueName?.trim() ? venueName : city}
            </h3>
            <div className="text-cream/80 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display text-cream font-semibold">
                    {addressText}
                  </p>
                  <p className="text-sm">{city}</p>
                </div>
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <span>📍</span> Haritada göster →
              </a>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
