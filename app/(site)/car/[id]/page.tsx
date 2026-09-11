import CarDetails from "@/components/Car/CarDetails";
import { getCarById } from "@/app/_lib/data-services";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStoreSettings } from "@/app/_lib/settings";

export default async function CarPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const car = await getCarById(Number(id));

  const settings = await getStoreSettings();

  if (!car) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Car not found.</p>
        <Link href="/car">
          <Button variant="outline">Back to Cars</Button>
        </Link>
      </div>
    );
  }

  return <CarDetails car={car} whatsappNumber={settings?.whatsapp} />;
}
