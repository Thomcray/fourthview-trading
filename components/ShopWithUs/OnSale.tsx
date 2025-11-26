"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

import shoeImage from "@/public/shoeImage.png";
import ProductPrice from "../ProductPrice";
import { useApp } from "../AppContext";
import Link from "next/link";

export default function OnSale() {
  const { allProducts: products } = useApp();

  const discountProducts = products.filter((item) => item.discount);

  return (
    <div className="border-0 px-8 max-sm:px-0 py-4 w-full">
      {discountProducts.length > 0 && (
        <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between">
          <h1 className="font-normal text-md w-96 max-sm:w-80 text-white">
            On Sale
          </h1>

          <ChevronRight
            color="white"
            strokeWidth={1.5}
            className="cursor-pointer"
          />
        </div>
      )}

      {discountProducts.length > 0 && (
        <div className="w-full h-fit flex flex-row space-y-2 items-center max-sm:space-x-4 md:space-x-4 py-2 px-4 max-sm:px-2 max-sm:overflow-x-scroll">
          {discountProducts.map((item, index) => (
            <div
              className="w-full h-full max-sm:w-40 space-x-4 border px-4 max-sm:px-0 py-4 max-sm:py-0 rounded-md"
              key={index}
            >
              <Link
                href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
              >
                <Image
                  src={shoeImage}
                  alt="item-image"
                  className="max-sm:w-40 max-sm:h-20 h-40 w-full object-cover rounded-md max-sm:rounded-none"
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

                  {/* <AddToCart /> */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
