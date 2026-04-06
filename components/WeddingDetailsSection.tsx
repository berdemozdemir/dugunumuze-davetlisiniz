import RevealSection from "./RevealSection";
import Ornament from "./Ornament";

const WeddingDetailsSection = () => (
  <section className="relative py-20 sm:py-28 px-4">
    <div className="relative z-10 max-w-5xl mx-auto">
      <RevealSection className="text-center mb-16">
        <h2 className="font-cursive text-4xl sm:text-5xl md:text-6xl gold-gradient-text mb-3">
          Düğün Detayları
        </h2>
        <div className="mt-4">
          <Ornament />
        </div>
      </RevealSection>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <RevealSection delay={200}>
          <div className="group h-full rounded-2xl p-6 sm:p-8 bg-white/3 border border-white/10 hover:border-gold/20 transition-all duration-500 hover:bg-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <span className="text-xs uppercase tracking-widest text-cream/40">
                İlk Düğün
              </span>
            </div>
            <h3 className="font-cursive text-3xl sm:text-4xl text-gold/80 mb-4">
              Elazığ
            </h3>
            <div className="space-y-3 text-cream/70">
              <div className="flex items-start gap-3">
                <span className="text-gold/60 mt-0.5">📅</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    4 Temmuz 2026
                  </p>
                  <p className="text-sm">Cumartesi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/60 mt-0.5">🕐</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    16:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/60 mt-0.5">📍</span>
                <div>
                  <p className="font-display font-semibold text-cream/90">
                    Petek Düğün Salonu
                  </p>
                  <p className="text-sm">
                    Cumhuriyet Mah. İzzetpaşa Cad. No: 42
                  </p>
                  <p className="text-sm">Elazığ Merkez</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Elazığ+Merkez+Düğün+Salonu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-gold/70 hover:text-gold transition-colors text-sm"
              >
                <span>📍</span> Haritada Göster →
              </a>
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="group relative h-full rounded-2xl p-6 sm:p-8 bg-linear-to-br from-gold/10 via-transparent to-burgundy/10 border-2 border-gold/30 hover:border-gold/50 transition-all duration-500 shadow-lg shadow-gold/5 hover:shadow-gold/15">
            <div className="absolute -top-3 right-6 bg-gold text-deep text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              Ana Düğün
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-xs uppercase tracking-widest text-gold/60">
                Büyük Gün
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
                  <p className="font-display font-semibold text-cream">
                    16:00
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-gold/70 mt-0.5">📍</span>
                <div>
                  <p className="font-display font-semibold text-cream">
                    Beytepe Garden
                  </p>
                  <p className="text-sm">
                    Beytepe Mah. Beytepe Garden Düğün ve Davet
                  </p>
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
