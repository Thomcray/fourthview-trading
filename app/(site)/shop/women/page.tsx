"use client";

import React from "react";
import Banner from "@/components/ShopWithUs/Banner";
import { usePathname } from "next/navigation";

import womenBanner from "@/public/womenBanner.png";
import GeneralOverlap from "@/components/ShopWithUs/GeneralOverlap";
import Shirts from "@/components/ShopWithUs/Shirts";
import Trousers from "@/components/ShopWithUs/Trousers";
import Jewelry from "@/components/ShopWithUs/Women/Jewelry";
import Shoes from "@/components/ShopWithUs/Men/Shoes";

export default function Page() {
  const pathName = usePathname();

  const currLocation = pathName === "/shop/women";

  const bannerText = "Shop from our Variety of Women's Essentials";
  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4">
      <Banner
        banner={womenBanner}
        location={currLocation}
        bannerText={bannerText}
      />

      <GeneralOverlap />
      <Shirts />
      <Trousers />
      <Jewelry />
      <Shoes />
    </section>
  );
}
