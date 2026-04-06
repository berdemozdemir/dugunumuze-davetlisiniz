import RevealSection from "./RevealSection";
import Ornament from "./Ornament";

const WeddingDetailsSection = () => (
  <section className="relative py-20 sm:py-28 px-4">
    <div className="relative z-10 max-w-6xl mx-auto">
      <RevealSection className="text-center mb-16">
        <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl gold-gradient-text mb-3">
          Etkinlik Detayları
        </h2>
        <div className="mt-4">
          <Ornament />
        </div>
      </RevealSection>

      <div className="grid md:grid-cols-3 gap-6">
        {/* 1. Kına Gecesi - 2 Temmuz */}
        <RevealSection delay={200}>
          <div className="group h-full rounded-2xl p-6 sm:p-8 bg-white/3 border border-white/10 hover:border-rose/30 transition-all duration-500 hover:bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🕯️</span>
              <span className="text-xs uppercase tracking-widest text-cream/40">
                Kına Gecesi
              </span>
            </div>
            <h3 className="font-cursive text-3xl sm:text-4xl text-rose mb-4">
              Kına
            </h3>
            <div className="space-y-3 text-cream/70">
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">📅</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    2 Temmuz 2026
                  </p>
                  <p className="text-sm">Perşembe</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">🕐</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    19:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-rose/60 mt-0.5">📍</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    Event My Mi Kına Salonu
                  </p>
                  <p className="text-sm">Elazığ</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Event+My+Mi+Kına+Salonu+Elazığ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-rose/70 hover:text-rose transition-colors text-sm"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>

        {/* 2. Elazığ Düğünü - 4 Temmuz */}
        <RevealSection delay={350}>
          <div className="group relative h-full rounded-2xl p-6 sm:p-8 bg-linear-to-br from-gold/10 via-transparent to-burgundy/10 border-2 border-gold/30 hover:border-gold/50 transition-all duration-500 shadow-lg shadow-gold/5 hover:shadow-gold/15">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <span className="text-xs uppercase tracking-widest text-gold/60">
                Elazığ Düğünü
              </span>
            </div>
            <h3 className="font-cursive text-3xl sm:text-4xl text-gold mb-4">
              Elazığ
            </h3>
            <div className="space-y-3 text-cream/80">
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📅</span>
                <div>
                  <p className="font-display font-semibold text-cream">
                    4 Temmuz 2026
                  </p>
                  <p className="text-sm">Cumartesi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">🕐</span>
                <div>
                  <p className="font-display font-semibold text-cream">19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display font-semibold text-cream">
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
                className="inline-flex items-center gap-1.5 mt-3 text-gold hover:text-gold-light transition-colors text-sm font-medium"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>

        {/* 3. Ankara Düğünü - 11 Temmuz */}
        <RevealSection delay={500}>
          <div className="group relative h-full rounded-2xl p-6 sm:p-8 bg-linear-to-br from-gold/10 via-transparent to-burgundy/10 border-2 border-gold/30 hover:border-gold/50 transition-all duration-500 shadow-lg shadow-gold/5 hover:shadow-gold/15">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-xs uppercase tracking-widest text-gold/60">
                Ankara Düğünü
              </span>
            </div>
            <h3 className="font-cursive text-3xl sm:text-4xl text-gold mb-4">
              Ankara
            </h3>
            <div className="space-y-3 text-cream/80">
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📅</span>
                <div>
                  <p className="font-display font-semibold text-cream">
                    11 Temmuz 2026
                  </p>
                  <p className="text-sm">Cumartesi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">🕐</span>
                <div>
                  <p className="font-display font-semibold text-cream">19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display font-semibold text-cream">
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
                className="inline-flex items-center gap-1.5 mt-3 text-gold hover:text-gold-light transition-colors text-sm font-medium"
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

export default WeddingDetailsSection;
