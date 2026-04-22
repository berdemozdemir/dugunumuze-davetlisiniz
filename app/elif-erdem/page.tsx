import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import SectionDivider from '@/components/SectionDivider';
import StorySection from '@/components/StorySection';
import EventDetailsSection from '@/components/EventDetailsSection';
import ClosingSection from '@/components/ClosingSection';
import MusicPlayer from '@/components/MusicPlayer';

export default function ElifErdemPage() {
  return (
    <main className="overflow-x-hidden">
      <MusicPlayer />

      <HeroSection />

      <CountdownSection />

      <SectionDivider />

      <StorySection />

      <SectionDivider />

      <EventDetailsSection />

      <SectionDivider />

      <ClosingSection />

      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-cream/30 text-xs tracking-wider">
          Elif ve Erdem &middot; 2026
        </p>
      </footer>
    </main>
  );
}
