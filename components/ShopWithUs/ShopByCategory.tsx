"use client";

import { useApp } from "../AppContext";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

import shoeImage from "@/public/shoeImage.png";
import Link from "next/link";

export default function ShopByCategory() {
  const { allCategories: categories } = useApp();

  return (
    <div className="border-0 px-8 py-4 w-full">
      <Link href="/category">
        <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between">
          <h1 className="font-normal text-md w-96 max-sm:w-80 text-white">
            Shop by Categories
          </h1>

          <div className="flex flex-row space-x-2">
            <p className="text-white underline">view more...</p>
            <ChevronRight
              color="white"
              strokeWidth={1.5}
              className="cursor-pointer"
            />
          </div>
        </div>
      </Link>

      <div className="w-full flex flex-row max-sm:pb-12 space-x-4 py-2 px-4 overflow-x-scroll border-0">
        {categories.map(
          (item, index) =>
            item.image_url && (
              <div className="flex flex-col gap-y-1 border-0">
                <div
                  className="flex-shrink-0 w-40 h-40 max-sm:w-32 max-sm:h-32 relative rounded-md overflow-hidden"
                  key={index}
                >
                  <Image
                    src={item.image_url}
                    alt={item.name || "category-image"}
                    fill
                    className="object-cover rounded-md max-sm:rounded-none"
                  />
                </div>

                <p className="w-full py-2 max-sm:px-0 text-black font-normal text-sm border-0">
                  {item.name}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
}
