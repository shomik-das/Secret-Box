import FeaturesSection from "@/components/home/features";
import HeroSection from "@/components/home/hero-section";
import {MarqueeDemo} from "@/components/home/marquee-demo";
import MessageCarousel from "@/components/home/message-carousal";


export default function Home() {
  return (
    <>
      <HeroSection />
      <MessageCarousel />
      <FeaturesSection />
    </>
  );
}
