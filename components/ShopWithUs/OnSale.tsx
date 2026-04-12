"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import ProductPrice from "../ProductPrice";
import { useApp } from "../AppContext";
import AddToCart from "../AddToCart";
import Link from "next/link";

export default function OnSale() {
  const { allProducts: products } = useApp();

  const discountProducts = products.filter((item) => item.discount);

  if (discountProducts.length === 0) return null;

  return (
    <div className="px-8 max-sm:px-2 py-4 w-full flex flex-col gap-3">
      {/* Header */}
      <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            SALE
          </span>
          <h1 className="font-normal text-base text-white">On Sale</h1>
        </div>
        <ChevronRight
          color="white"
          strokeWidth={1.5}
          className="cursor-pointer"
        />
      </div>

      {/* Products */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2">
        {discountProducts.map((item, index) => (
          <div
            key={index}
            className="shrink-0 w-44 max-sm:w-36 flex flex-col border rounded-md overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link
              href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
            >
              <div className="relative">
                <Image
                  src={item.imageUrl[0]}
                  alt={item.name || "item-image"}
                  width={200}
                  height={200}
                  className="w-full h-36 max-sm:h-24 object-cover"
                />
                {/* Discount badge */}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{item.discount}%
                </span>
              </div>

              <div className="px-2 pt-2 flex flex-col gap-1">
                <p className="text-blue-950 font-normal text-sm truncate">
                  {item.name}
                </p>

                {/* Original price - struck through */}
                <p className="text-xs text-slate-400 line-through">
                  <ProductPrice yuanPrice={item.price} />
                </p>

                {/* Discounted price */}
                <p className="text-sm font-semibold text-red-500">
                  <ProductPrice
                    yuanPrice={item.price}
                    discount={item.discount}
                  />
                </p>
              </div>
            </Link>

            <div className="px-2 py-2">
              <AddToCart data={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
