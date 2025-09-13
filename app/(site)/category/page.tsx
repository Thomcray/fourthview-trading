import Banner from "@/components/ShopWithUs/Banner";
import React from "react";

import shopBanner from "@/public/shopBanner.png";
import Category from "@/components/CategorySection/Category";

export default function page() {
  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4">
      <Banner banner={shopBanner} />

      <Category />
    </section>
  );
}
