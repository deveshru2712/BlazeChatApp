import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Navbar />
      <HeroSection />
    </div>
  );
}
