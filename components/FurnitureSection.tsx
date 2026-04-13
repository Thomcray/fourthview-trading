import FeatureSection from "@/components/FeatureSection";
import furnitureImage from "@/public/furnitureImage.png";

export default function FurnitureSection() {
  return (
    <FeatureSection
      heading="Furniture"
      body="From sleek contemporary pieces to timeless classics, we've got something for every aesthetic. Elevate your space with elegance and comfort."
      href="/furniture"
      image={furnitureImage}
      imageAlt="shop-with-us"
    />
  );
}
