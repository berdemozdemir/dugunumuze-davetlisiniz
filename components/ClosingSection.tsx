import Image from "next/image";
import RevealSection from "./RevealSection";
import Ornament from "./Ornament";

const ClosingSection = () => (
  <section className="relative py-20 sm:py-28 px-4">
    <div className="relative z-10 max-w-2xl mx-auto text-center">
      <RevealSection>
        <div className="relative inline-block mb-10">
          <div className="absolute -inset-3 rounded-2xl border border-gold/30 rotate-3" />
          <div className="absolute -inset-3 rounded-2xl border border-gold/15 -rotate-2" />
          <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 ring-2 ring-gold/20">
            <Image
              src="/images/nisan-2.jpeg"
              alt="Elif & Erdem"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </RevealSection>

      <RevealSection delay={200}>
        <Ornament />
        <blockquote className="font-display italic text-xl sm:text-2xl md:text-3xl text-cream/80 leading-relaxed mt-8 mb-6">
          &ldquo;Her hikâyenin en güzel bölümü,
          <br />
          <span className="gold-gradient-text font-semibold">
            birlikte
          </span>{" "}
          yazılan kısmıdır.&rdquo;
        </blockquote>
      </RevealSection>

      <RevealSection delay={400}>
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
