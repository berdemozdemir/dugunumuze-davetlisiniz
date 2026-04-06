import Image from "next/image";
import { HEARTS } from "@/lib/constants";
import Ornament from "./Ornament";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <Image
        src="/pngtree-wedding-invitation-bg.jpg"
        alt="Düğün davetiyesi arka planı"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-deep/90 via-deep/80 to-deep/95" />
    </div>

    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {HEARTS.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-gold/20"
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

    <div className="relative z-10 text-center px-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <p className="text-gold-light uppercase tracking-[0.3em] text-xs sm:text-sm mb-6">
          Düğünümüze davetlisiniz
        </p>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.6s", animationFillMode: "both" }}
      >
        <h1 className="font-cursive text-6xl sm:text-7xl md:text-8xl lg:text-9xl gold-gradient-text leading-tight">
          Elif
        </h1>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "0.9s", animationFillMode: "both" }}
      >
        <span className="inline-block text-rose text-3xl sm:text-4xl animate-heartbeat my-2">
          ♥
        </span>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "1.2s", animationFillMode: "both" }}
      >
        <h1 className="font-cursive text-6xl sm:text-7xl md:text-8xl lg:text-9xl gold-gradient-text leading-tight">
          Erdem
        </h1>
      </div>

      <div
        className="animate-fade-in-up"
        style={{ animationDelay: "1.6s", animationFillMode: "both" }}
      >
        <div className="my-6">
          <Ornament />
        </div>
        <p className="font-display text-lg sm:text-xl md:text-2xl text-cream italic tracking-wide">
          Evleniyoruz
        </p>
        <p className="text-gold-light mt-3 text-sm sm:text-base tracking-wider">
          4 & 11 Temmuz 2026
        </p>
      </div>

      <div
        className="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animationDelay: "2.5s", animationFillMode: "both" }}
      >
        <div className="animate-bounce-soft text-gold text-2xl">↓</div>
      </div>
    </div>
  </section>
);

export default HeroSection;
