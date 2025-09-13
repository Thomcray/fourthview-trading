"use client";

import categories from "@/components/CategorySection/categoryList";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  itemName: string;
  image: StaticImageData;
}

export default function Item() {
  const [categoryItems, setCategoryItems] = useState<Category[] | null>(null);
  const searchParams = useSearchParams();

  const category = searchParams.get("q");

  useEffect(() => {
    if (category) {
      try {
        const getCategory =
          categories.categories[category as keyof typeof categories.categories];

        if (getCategory) {
          setCategoryItems(getCategory);
        } else {
          console.log("Category not found");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [category]);
  return (
    <section className="w-full h-full flex items-center border px-12 sm:px-2 py-8 max-sm:px-4 bg-blue-50">
      <div className="w-full grid grid-cols-4 gap-x-4 max-sm:grid-cols-2 items-center border-0 max-sm:gap-y-4 md:space-x-4 py-2 max-sm:pb-12 px-4 max-sm:px-2">
        {categoryItems?.map((item) => (
          <div
            key={item.id}
            className="w-full h-full bg-white max-sm:w-40 space-x-4 border px-4 max-sm:px-0 py-4 max-sm:py-0 rounded-md"
          >
            <Link
              href={`/item-description?category=${category}&q=${item.itemName}`}
              className="w-full"
            >
              <Image
                src={item.image}
                alt="item-image"
                className="max-sm:w-40 max-sm:h-20 h-40 w-full object-cover rounded-md max-sm:rounded-none"
              />
            </Link>
            <p className="px-2 pt-2  text-blue-950 font-semibold">
              {item.itemName}
            </p>

            <p className="px-2 max-sm:px-2  py-0 max-sm:px-o text-blue-950 font-semibold">
              $20
            </p>

            <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
              <Button
                variant="outline"
                className="bg-[#334EAC] text-white font-semibold cursor-pointer"
              >
                Purchase
              </Button>
              <Button variant="outline" className="cursor-pointer px-4">
                <ShoppingCart color="#334EAC" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
