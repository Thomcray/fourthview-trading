import BookWithUs from "@/components/Travel/BookWithUs";
import ServicesOffered from "@/components/Travel/ServicesOffered";
import TopSection from "@/components/Travel/TopSection";

export default function TravelPage() {
  return (
    <section className="relative flex flex-col py-12 w-full items-center border-0 space-y-6">
      <TopSection />
      <ServicesOffered />
      <BookWithUs />
    </section>
  );
}
