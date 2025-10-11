import FeaturesSection from "@/components/home/features";
import HeroSection from "@/components/home/hero-section";
import MessageCarousel from "@/components/home/message-carousal";
import { CTASection } from "@/components/home/cta-section";


export default function Home() {
  return (
    <>
      <HeroSection />
      <MessageCarousel />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
