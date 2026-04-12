"use client";

import { useApp } from "../AppContext";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShopByCategory() {
  const { allCategories: categories } = useApp();

  if (categories.length === 0) return null;

  return (
    <div className="px-8 max-sm:px-2 py-4 w-full flex flex-col gap-3">
      {/* Header */}
      <Link href="/category">
        <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between items-center hover:bg-[#2a3f8f] transition-colors">
          <h1 className="font-normal text-base text-white">
            Shop by Categories
          </h1>
          <ChevronRight color="white" strokeWidth={1.5} />
        </div>
      </Link>

      {/* Categories */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2">
        {categories.map(
          (item, index) =>
            item.image_url && (
              <Link
                key={index}
                href={`/category/${item.id}`}
                className="shrink-0 flex flex-col gap-2 group"
              >
                <div className="w-36 h-36 max-sm:w-28 max-sm:h-28 relative rounded-xl overflow-hidden border shadow-sm group-hover:shadow-md transition-shadow">
                  <Image
                    src={item.image_url}
                    alt={item.name || "category-image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay with name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <p className="text-white text-xs font-medium leading-tight">
                      {item.name}
                    </p>
                  </div>
                </div>
              </Link>
            ),
        )}
      </div>
    </div>
  );
}
