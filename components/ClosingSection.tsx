import RevealSection from './RevealSection';
import Ornament from './Ornament';
import PhotoCarousel from './PhotoCarousel';

const CLOSING_DEMO_PHOTOS = [
  { src: '/images/nisan-2.jpeg', alt: 'Elif & Erdem - Nişan' },
  { src: '/images/nisan-4.jpeg', alt: 'Elif & Erdem - Nişan Yürüyüşü' },
  { src: '/images/nisan-5.jpeg', alt: 'Elif & Erdem - Nişan Girişi' },
  { src: '/images/nisan-3.jpeg', alt: 'Elif & Erdem - Nişan Töreni' },
];

const ClosingSection = () => (
  <section className="relative px-4 py-20 sm:py-28">
    <div className="relative z-10 mx-auto max-w-2xl text-center">
      <RevealSection>
        <PhotoCarousel photos={CLOSING_DEMO_PHOTOS} />
      </RevealSection>

      <RevealSection delay={200}>
        <div className="mt-10">
          <Ornament />
        </div>
        <blockquote className="font-display text-cream/80 mt-8 mb-6 text-xl leading-relaxed italic sm:text-2xl md:text-3xl">
          &ldquo;Her hikâyenin en güzel bölümü,
          <br />
          <span className="gold-gradient-text font-semibold">
            birlikte
          </span>{' '}
          yazılan kısmıdır.&rdquo;
        </blockquote>
      </RevealSection>

      <RevealSection delay={400}>
        <p className="text-cream/60 mx-auto max-w-lg text-sm leading-relaxed sm:text-base">
          Hayatımızın en mutlu gününde sizi de aramızda görmek istiyoruz.
          Varlığınız en güzel hediyemiz olacak.
        </p>
      </RevealSection>

      <RevealSection delay={600}>
        <div className="mt-12">
          <p className="font-cursive gold-gradient-text text-3xl sm:text-4xl">
            Elif & Erdem
          </p>
          <p className="text-cream/40 mt-4 text-xs tracking-widest uppercase">
            Temmuz 2026
          </p>
        </div>
      </RevealSection>
    </div>
  </section>
);

export default ClosingSection;
