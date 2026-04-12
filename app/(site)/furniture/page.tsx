"use client";

import { useState } from "react";
import Banner from "@/components/ShopWithUs/Banner";
import FurnitureCategoryFilter from "@/components/Furniture/FurnitureCategoryFilter";
import FurnitureCategorySection from "@/components/Furniture/FurnitureCategorySection";
import furnitureBanner from "@/public/furnitureBanner.png";

const CATEGORIES = ["Modern Style", "Antique", "Chinese Style"];

export default function FurniturePage() {
  const [selected, setSelected] = useState("All Categories");

  const categoriesToShow =
    selected === "All Categories" ? CATEGORIES : [selected];

  return (
    <section className="flex flex-col w-full items-center gap-6 pb-10">
      <Banner
        banner={furnitureBanner}
        location={true}
        bannerText="Make Your Home Feel Like Home"
      />
      <FurnitureCategoryFilter selected={selected} onSelect={setSelected} />

      {categoriesToShow.map((cat) => (
        <FurnitureCategorySection key={cat} categoryName={cat} />
      ))}
    </section>
  );
}
