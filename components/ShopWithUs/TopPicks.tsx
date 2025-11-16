"use client";

import { useApp } from "../AppContext";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import ProductPrice from "../ProductPrice";
import AddToCart from "../AddToCart";
import Link from "next/link";
// import AddToCart from "../AddToCart";

export default function TopPicks() {
  const { allProducts: products } = useApp();

  const pathName = usePathname();

  const shopTypeMap: Record<string, string> = {
    "/shop/men": "men",
    "/shop/women": "women",
  };

  const shopType = shopTypeMap[pathName] || "";

  const productTarget = products.filter((product) =>
    product.target.toLowerCase().includes(shopType)
  );

  return (
    <div
      className={
        shopType
          ? "border-0 px-0 max-sm:px-2 py-4 w-full flex flex-col"
          : "border-0 px-8 py-4 w-full flex flex-col"
      }
    >
      {productTarget.length > 0 && (
        <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between">
          <h1 className="font-normal text-md w-96 max-sm:w-80 text-white">
            Top Picks for You
          </h1>

          <ChevronRight
            color="white"
            strokeWidth={1.5}
            className="cursor-pointer"
          />
        </div>
      )}

      {productTarget.length > 0 && (
        <div className="w-full h-fit flex flex-row items-center border-0 max-sm:space-x-4 md:space-x-4 py-2 max-sm:pb-12 px-4 max-sm:px-2 max-sm:overflow-x-scroll">
          {productTarget.map((item, index) => (
            <div
              className="relative w-80 bg-white max-sm:w-40 space-x-4 border px-4 max-sm:px-0 py-4 max-sm:py-0 rounded-md"
              key={index}
            >
              <Link
                href={`/item-description?category=${item.categoryId}&q=${item.name.toLowerCase()}`}
              >
                <Image
                  src={item.imageUrl[0]}
                  alt="item-image"
                  width={200}
                  height={200}
                  className=" max-sm:w-40 max-sm:h-20 h-60 w-full object-cover rounded-md max-sm:rounded-none cursor-pointer"
                />
                <p className="px-2 pt-2  text-blue-950 font-normal">
                  {item.name}
                </p>

                <p className="px-2 max-sm:px-2 py-0 max-sm:px-o text-blue-950 font-normal">
                  <ProductPrice yuanPrice={item.price} />
                </p>

                <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
                  <Button
                    variant="outline"
                    className="bg-[#334EAC] text-white font-semibold cursor-pointer"
                  >
                    Purchase
                  </Button>

                  <AddToCart data={item} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
