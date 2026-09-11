import carImage from "@/public/car.jpg";
import FeatureSection from "./FeatureSection";

export default function CarSection() {
  return (
    <FeatureSection
      heading="Find your perfect car"
      body="Browse a wide selection of vehicles from trusted dealers and private sellers. Whether you need a reliable daily driver or a premium ride, compare prices, check specs, and drive away with confidence."
      href="/car"
      image={carImage}
      imageAlt="car-section"
      badge="Vehicles"
      buttonText="Explore Cars"
      reverse
    />
  );
}
