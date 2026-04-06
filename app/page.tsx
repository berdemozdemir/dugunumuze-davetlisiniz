import HeroSection from "@/components/HeroSection";
import CountdownSection from "@/components/CountdownSection";
import SectionDivider from "@/components/SectionDivider";
import StorySection from "@/components/StorySection";
import WeddingDetailsSection from "@/components/WeddingDetailsSection";
import ClosingSection from "@/components/ClosingSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <CountdownSection />
      <SectionDivider />
      <StorySection />
      <SectionDivider />
      <WeddingDetailsSection />
      <SectionDivider />
      <ClosingSection />
    </main>
  );
}
