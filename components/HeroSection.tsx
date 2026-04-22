import Image from 'next/image';
import { HEARTS } from '@/lib/constants';
import Ornament from './Ornament';

const HeroSection = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src="/images/pngtree-wedding-invitation-bg.jpg"
        alt="Düğün davetiyesi arka planı"
        fill
        className="object-cover"
        priority
      />
      <div className="from-deep/90 via-deep/80 to-deep/95 absolute inset-0 bg-linear-to-b" />
    </div>

    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="text-gold/20 absolute bottom-0"
          style={{
            left: h.left,
            fontSize: `${h.size}px`,
            animation: `floatHeart ${h.duration} ${h.delay} ease-in infinite`,
          }}
        >
          ♥
        </span>
      ))}
    </div>

    <div className="relative z-10 px-6 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
      >
        <p className="text-gold-light mb-6 text-xs tracking-[0.3em] uppercase sm:text-sm">
          Düğünümüze davetlisiniz
        </p>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
      >
        <h1 className="font-cursive gold-gradient-text text-6xl leading-tight sm:text-7xl md:text-8xl lg:text-9xl">
          Elif
        </h1>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
      >
        <span className="text-gold animate-heartbeat my-2 inline-block text-3xl sm:text-4xl">
          ♥
        </span>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '1.2s', animationFillMode: 'both' }}
      >
        <h1 className="font-cursive gold-gradient-text text-6xl leading-tight sm:text-7xl md:text-8xl lg:text-9xl">
          Erdem
        </h1>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '1.6s', animationFillMode: 'both' }}
      >
        <div className="my-6">
          <Ornament />
        </div>
        <p className="font-display text-cream text-lg tracking-wide italic sm:text-xl md:text-2xl">
          Evleniyoruz
        </p>
        <p className="text-gold-light mt-3 text-sm tracking-wider sm:text-base">
          4 ve 11 Temmuz 2026
        </p>
      </div>

      <div
        className="animate-fade-in absolute -bottom-10 left-1/2 -translate-x-1/2"
        style={{ animationDelay: '2.5s', animationFillMode: 'both' }}
      >
        <div className="animate-bounce-soft text-gold text-2xl">↓</div>
      </div>
    </div>
  </section>
);

export default HeroSection;
