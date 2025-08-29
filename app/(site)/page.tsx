import FurnitureSection from "@/components/FurnitureSection";
import Hero from "@/components/Hero";
import MoneySection from "@/components/MoneySection/MoneySection";
import OpenCompany from "@/components/OpenCompany";
import ShopWithUs from "@/components/ShopWithUs";
import TravelGuide from "@/components/TravelGuide";

export default function Home() {
  return (
    <main className="relative z-10 border-0 flex flex-col space-y-4 bg-blue-50">
      <Hero />
      <MoneySection />
      <ShopWithUs />
      <TravelGuide />
      <FurnitureSection />
      <OpenCompany />
    </main>
  );
}
