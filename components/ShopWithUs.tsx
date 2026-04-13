import shopWithUsImage from "@/public/shopWith.png";
import FeatureSection from "./FeatureSection";

export default function ShopWithUs() {
  return (
    <FeatureSection
      heading="Shop with us"
      body="Whether you're hunting for everyday essentials or that one special find, our intuitive layout and smart search features ensure you get exactly what you need with minimal fuss. Dive in and explore"
      href="/shop"
      image={shopWithUsImage}
      imageAlt="shop-with-us"
    />
  );
}
