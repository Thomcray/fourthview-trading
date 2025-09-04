import Banner from "@/components/ShopWithUs/Banner";
import BannerOverlay from "@/components/ShopWithUs/BannerOverlay";
import OnSale from "@/components/ShopWithUs/OnSale";
import ShopByCategory from "@/components/ShopWithUs/ShopByCategory";
import TopPicks from "@/components/ShopWithUs/TopPicks";

import shopBanner from "@/public/shopBanner.png";

export default function page() {
  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4">
      <Banner banner={shopBanner} />
      <BannerOverlay />
      <ShopByCategory />
      <TopPicks />
      <OnSale />
    </section>
  );
}
