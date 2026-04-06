import Image from "next/image";
import RevealSection from "./RevealSection";
import Ornament from "./Ornament";

const StorySection = () => (
  <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src="/images/nisan-1.jpeg"
        alt="Elif & Erdem - Nişan"
        fill
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-linear-to-b from-deep/60 via-deep/40 to-deep/70" />
    </div>

    <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
      <RevealSection>
        <Ornament />

        <p className="font-cursive text-4xl sm:text-5xl md:text-6xl gold-gradient-text mt-6 mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Bir &ldquo;Evet&rdquo; ile Başladı
        </p>
        <p className="text-cream/90 text-sm sm:text-base tracking-wider drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          Şimdi sıra sonsuza dek &ldquo;evet&rdquo; demeye geldi
        </p>
        <div className="mt-6">
          <Ornament />
        </div>
      </RevealSection>
    </div>
  </section>
);

export default StorySection;
