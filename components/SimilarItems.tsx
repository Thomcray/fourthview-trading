"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "./AppContext";
import ProductPrice from "./ProductPrice";
import AddToCart from "./AddToCart";
import { useMemo } from "react";

type Item = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount?: number;
  discountType?: string;
  target: string;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
  created_at: string;
};

type Props = {
  selectedItem: Item | null | undefined;
};

export default function SimilarItems({ selectedItem }: Props) {
  const { allProducts: products } = useApp();

  const similar = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.id !== selectedItem?.id &&
            (p.categoryId === selectedItem?.categoryId ||
              p.productType === selectedItem?.productType),
        )
        .slice(0, 8),
    [products, selectedItem],
  );

  if (!selectedItem || similar.length === 0) return null;

  return (
    <div className="py-4 w-full flex flex-col gap-3">
      {/* Header */}
      <div className="bg-[#334EAC] rounded-md px-4 py-2 flex flex-row justify-between items-center">
        <h1 className="font-normal text-base text-white">Similar Items</h1>
        <ChevronRight
          color="white"
          strokeWidth={1.5}
          className="cursor-pointer"
        />
      </div>

      {/* Products */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2">
        {similar.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-48 max-sm:w-36 flex flex-col border rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            <Link
              href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
            >
              <div className="relative">
                <Image
                  src={item.imageUrl[0]}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-44 max-sm:h-28 object-cover"
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
