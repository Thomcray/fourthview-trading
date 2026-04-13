import FeatureSection from "@/components/FeatureSection";
import chineseStatue from "@/public/chineseStatue.png";

export default function OpenCompany() {
  return (
    <FeatureSection
      heading="Open Company in China"
      body="Looking to enter the Chinese market? We make the process simple and efficient, from registration to full setup."
      href="/open-a-company"
      image={chineseStatue}
      imageAlt="shop-with-us"
      reverse
    />
  );
}
