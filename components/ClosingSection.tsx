import RevealSection from "./RevealSection";
import Ornament from "./Ornament";

const ClosingSection = () => (
  <section className="relative py-20 sm:py-28 px-4">
    <div className="relative z-10 max-w-2xl mx-auto text-center">
      <RevealSection>
        <div className="text-gold/30 text-6xl sm:text-7xl font-cursive animate-spin-slow mb-6 inline-block">
          ✦
        </div>
      </RevealSection>

      <RevealSection delay={200}>
        <blockquote className="font-display italic text-xl sm:text-2xl md:text-3xl text-cream/80 leading-relaxed mb-6">
          &ldquo;Her hikâyenin en güzel bölümü,
          <br />
          <span className="gold-gradient-text font-semibold">
            birlikte
          </span>{" "}
          yazılan kısmıdır.&rdquo;
        </blockquote>
      </RevealSection>

      <RevealSection delay={400}>
        <div className="my-8">
          <Ornament />
        </div>
        <p className="text-cream/60 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Hayatımızın en mutlu gününde sizi de aramızda görmek istiyoruz.
          Varlığınız en güzel hediyemiz olacak.
        </p>
      </RevealSection>

      <RevealSection delay={600}>
        <div className="mt-12">
          <p className="font-cursive text-3xl sm:text-4xl gold-gradient-text">
            Elif & Erdem
          </p>
          <p className="text-cream/40 text-xs mt-4 tracking-widest uppercase">
            Temmuz 2026
          </p>
        </div>
      </RevealSection>
    </div>
  </section>
);

export default ClosingSection;
