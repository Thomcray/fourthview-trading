"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";

import shoeImage from "@/public/shoeImage.png";

export default function Shirts() {
  const pathName = usePathname();

  const shopType = pathName === "/shop/men" || pathName === "/shop/women";
  return (
    <div
      className={
        shopType
          ? "border-0 px-8 max-sm:px-2 py-4 w-full flex flex-col"
          : "border-0 px-8 py-4 w-full flex flex-col"
      }
    >
      <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between">
        <h1 className="font-normal text-md w-96 max-sm:w-80 text-white">
          Shirts
        </h1>

        <ChevronRight
          color="white"
          strokeWidth={1.5}
          className="cursor-pointer"
        />
      </div>

      <div className="w-full h-fit flex flex-row max-sm:pb-12 space-y-2 items-center max-sm:space-x-4 md:space-x-4 py-2 px-4 max-sm:px-2 max-sm:overflow-x-scroll">
        {["Bags", "Shoes", "Socks", "Caps"].map((item, index) => (
          <div
            className="w-full h-full max-sm:w-40 space-x-4 border px-4 max-sm:px-0 py-4 max-sm:py-0 rounded-md"
            key={index}
          >
            <Image
              src={shoeImage}
              alt="item-image"
              className="max-sm:w-40 max-sm:h-20 h-40 w-full object-cover rounded-md max-sm:rounded-none"
            />
            <p className="px-2 pt-2  text-blue-950 font-semibold">{item}</p>

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
              <Button variant="outline" className="cursor-pointer px-4 w-fit">
                <ShoppingCart color="#334EAC" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
