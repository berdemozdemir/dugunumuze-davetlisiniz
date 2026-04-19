import RevealSection from './RevealSection';
import Ornament from './Ornament';

const EventDetailsSection = () => (
  <section className="relative px-4 py-20 sm:py-28">
    <div className="relative z-10 mx-auto max-w-6xl">
      <RevealSection className="mb-16 text-center">
        <h2 className="font-cursive gold-gradient-text mb-3 text-4xl sm:text-5xl md:text-6xl">
          Etkinlik Detayları
        </h2>
        <div className="mt-4">
          <Ornament />
        </div>
      </RevealSection>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 1. Kına Gecesi - 2 Temmuz */}
        <RevealSection delay={200}>
          <div className="group hover:border-rose/30 h-full rounded-2xl border border-white/10 bg-white/3 p-6 transition-all duration-500 hover:bg-white/5 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🕯️</span>
              <span className="text-cream/40 text-xs tracking-widest uppercase">
                Kına Gecesi
              </span>
            </div>
            <h3 className="font-cursive text-rose mb-4 text-3xl sm:text-4xl">
              Kına
            </h3>
            <div className="text-cream/70 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">📅</span>
                <div>
                  <p className="font-display text-cream/90 font-semibold">
                    2 Temmuz 2026
                  </p>
                  <p className="text-sm">Perşembe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">🕐</span>
                <div>
                  <p className="font-display text-cream/90 font-semibold">
                    19:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">📍</span>
                <div>
                  <p className="font-display text-cream/90 font-semibold">
                    Event My Mi Kına Salonu
                  </p>
                  <p className="text-sm">Elazığ</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Event+My+Mi+Kına+Salonu+Elazığ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose/70 hover:text-rose mt-3 inline-flex items-center gap-1.5 text-sm transition-colors"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>

        {/* 2. Elazığ Düğünü - 4 Temmuz */}
        <RevealSection delay={350}>
          <div className="group from-gold/10 to-burgundy/10 border-gold/30 hover:border-gold/50 shadow-gold/5 hover:shadow-gold/15 relative h-full rounded-2xl border-2 bg-linear-to-br via-transparent p-6 shadow-lg transition-all duration-500 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="text-gold/60 text-xs tracking-widest uppercase">
                Elazığ Düğünü
              </span>
            </div>
            <h3 className="font-cursive text-gold mb-4 text-3xl sm:text-4xl">
              Elazığ
            </h3>
            <div className="text-cream/80 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📅</span>
                <div>
                  <p className="font-display text-cream font-semibold">
                    4 Temmuz 2026
                  </p>
                  <p className="text-sm">Cumartesi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">🕐</span>
                <div>
                  <p className="font-display text-cream font-semibold">19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display text-cream font-semibold">
                    Kral Palace Düğün Salonu
                  </p>
                  <p className="text-sm">VIP Salon</p>
                  <p className="text-sm">Elazığ</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Kral+Palace+Düğün+Salonu+Elazığ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>

        {/* 3. Ankara Düğünü - 11 Temmuz */}
        <RevealSection delay={500}>
          <div className="group from-gold/10 to-burgundy/10 border-gold/30 hover:border-gold/50 shadow-gold/5 hover:shadow-gold/15 relative h-full rounded-2xl border-2 bg-linear-to-br via-transparent p-6 shadow-lg transition-all duration-500 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-gold/60 text-xs tracking-widest uppercase">
                Ankara Düğünü
              </span>
            </div>
            <h3 className="font-cursive text-gold mb-4 text-3xl sm:text-4xl">
              Ankara
            </h3>
            <div className="text-cream/80 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📅</span>
                <div>
                  <p className="font-display text-cream font-semibold">
                    11 Temmuz 2026
                  </p>
                  <p className="text-sm">Cumartesi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">🕐</span>
                <div>
                  <p className="font-display text-cream font-semibold">19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display text-cream font-semibold">
                    Beytepe Garden
                  </p>
                  <p className="text-sm">Düğün ve Davet</p>
                  <p className="text-sm">Çankaya, Ankara</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Beytepe+Garden+Ankara"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  </section>
);

export default EventDetailsSection;
