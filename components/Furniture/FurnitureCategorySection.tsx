"use client";

import { useApp } from "@/components/AppContext";
import AddToCart from "@/components/AddToCart";
import ProductPrice from "@/components/ProductPrice";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  categoryName: string;
};

export default function FurnitureCategorySection({ categoryName }: Props) {
  const { allProducts } = useApp();

  const items = allProducts.filter(
    (p) =>
      p.productType.toLowerCase() === "furniture" &&
      p.target.toLowerCase().includes(categoryName.toLowerCase()),
  );

  if (items.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3 px-4">
      {/* Section header */}
      <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between items-center">
        <h2 className="text-white text-base font-normal">{categoryName}</h2>
        <ChevronRight
          color="white"
          strokeWidth={1.5}
          className="cursor-pointer"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex flex-col border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            <Link
              href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
            >
              <div className="relative">
                <Image
                  src={item.imageUrl[0]}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                {item.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{item.discount}%
                  </span>
                )}
              </div>

              <div className="px-2 pt-2 flex flex-col gap-1">
                <p className="text-blue-950 font-medium text-sm truncate">
                  {item.name}
                </p>
                {item.discount ? (
                  <>
                    <p className="text-xs text-slate-400 line-through">
                      <ProductPrice yuanPrice={item.price} />
                    </p>
                    <p className="text-sm font-semibold text-red-500">
                      <ProductPrice
                        yuanPrice={item.price}
                        discount={item.discount}
                      />
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-blue-950">
                    <ProductPrice yuanPrice={item.price} />
                  </p>
                )}
              </div>
            </Link>

            <div className="px-2 py-2 mt-auto">
              <AddToCart data={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
