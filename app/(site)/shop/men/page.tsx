"use client";

import React from "react";
import Banner from "@/components/ShopWithUs/Banner";
import GeneralOverlap from "@/components/ShopWithUs/GeneralOverlap";
import Shirts from "@/components/ShopWithUs/Shirts";
import Shoes from "@/components/ShopWithUs/Men/Shoes";
import Trousers from "@/components/ShopWithUs/Trousers";

import menBanner from "@/public/menBanner.png";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname();

  const currLocation = pathName === "/shop/men";

  const bannerText = "Shop from our Variety of Men's Essentials";
  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4">
      <Banner
        banner={menBanner}
        location={currLocation}
        bannerText={bannerText}
      />

      <GeneralOverlap />
      <Shirts />
      <Trousers />
      <Shoes />
    </section>
  );
}
