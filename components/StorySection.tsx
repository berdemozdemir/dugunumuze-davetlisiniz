import Image from 'next/image';
import RevealSection from './RevealSection';
import Ornament from './Ornament';

const StorySection = () => (
  <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden sm:min-h-[70vh]">
    <div className="absolute inset-0">
      <Image
        src="/images/nisan-1.jpeg"
        alt="Elif & Erdem - Nişan"
        fill
        className="object-cover object-top"
      />
      <div className="from-deep/60 via-deep/40 to-deep/70 absolute inset-0 bg-linear-to-b" />
    </div>

    <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
      <RevealSection>
        <Ornament />

        <p className="font-cursive gold-gradient-text mt-6 mb-4 text-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-5xl md:text-6xl">
          Bir &ldquo;Evet&rdquo; ile Başladı
        </p>
        <p className="text-cream/90 text-sm tracking-wider drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-base">
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
