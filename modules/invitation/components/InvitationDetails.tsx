import RevealSection from '@/components/RevealSection';
import Ornament from '@/components/Ornament';
import type { EventDetailCard } from '@/modules/invitation/types';

type Props = {
  events: EventDetailCard[];
};

function buildMapsQuery(card: EventDetailCard): string {
  return [card.venueName, card.addressText, card.city]
    .filter(Boolean)
    .join(' ');
}

function resolveCardHeading(card: EventDetailCard): string {
  if (card.venueName?.trim()) {
    return card.venueName.trim();
  }
  if (card.city?.trim()) {
    return card.city.trim();
  }
  return card.title;
}

function hasAnyLocationText(card: EventDetailCard): boolean {
  return Boolean(
    card.addressText?.trim() ||
      card.city?.trim() ||
      card.venueName?.trim(),
  );
}

type EventDetailCardItemProps = {
  card: EventDetailCard;
  index: number;
};

function EventDetailCardItem({ card, index }: EventDetailCardItemProps) {
  const mapsQuery = buildMapsQuery(card);
  const hasMapsLink = mapsQuery.length > 0;
  const showLocationSection = hasAnyLocationText(card);
  const heading = resolveCardHeading(card);
  const delayMs = 200 + index * 100;

  return (
    <RevealSection delay={delayMs}>
      <div className="group border-gold/30 from-gold/10 to-burgundy/10 shadow-gold/5 hover:border-gold/50 hover:shadow-gold/15 relative rounded-2xl border-2 bg-linear-to-br via-transparent p-6 shadow-lg transition-all duration-500 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-gold/60 text-xs tracking-widest uppercase">
            {card.title}
          </span>
        </div>

        <h3 className="font-cursive text-gold mb-4 text-3xl sm:text-4xl">
          {heading}
        </h3>

        {showLocationSection && (
          <div className="text-cream/80 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-gold/70 mt-0.5">📍</span>
              <div>
                {Boolean(card.addressText?.trim()) && (
                  <p className="font-display text-cream font-semibold">
                    {card.addressText}
                  </p>
                )}
                {Boolean(card.city?.trim()) && (
                  <p className="text-sm">{card.city}</p>
                )}
              </div>
            </div>

            {hasMapsLink && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <span>📍</span> Haritada göster →
              </a>
            )}
          </div>
        )}

        {!showLocationSection && (
          <p className="text-cream/50 text-sm">Konum bilgisi eklenmedi.</p>
        )}
      </div>
    </RevealSection>
  );
}

export function InvitationDetails({ events }: Props) {
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

        <div className="space-y-8">
          {events.map((card, index) => (
            <EventDetailCardItem key={`${card.title}-${index}`} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
