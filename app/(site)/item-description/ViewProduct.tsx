"use client";

import AddToCart from "@/components/AddToCart";
import ProductPrice from "@/components/ProductPrice";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Item = {
  id: number;
  created_at: string;
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
};

type SelectedItem = Item | undefined | null;

type ViewProductProps = {
  selectedItem: SelectedItem;
};
export default function ViewProduct({ selectedItem }: ViewProductProps) {
  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setqty] = useState(1);

  // Reset imageIdx when a new product is loaded to avoid stale indexes
  useEffect(() => {
    setImageIdx(0);
  }, [selectedItem?.id]);

  const handleImageColour = (idx: number) => {
    if (!selectedItem) return;

    const safeIdx = Math.min(
      idx,
      Math.max(0, selectedItem.imageUrl.length - 1)
    );
    setImageIdx(safeIdx);
  };

  if (!selectedItem) return null;
  return (
    <div className="flex flex-col px-12 py-10 w-full h-full max-sm:h-full max-sm:px-0 space-y-4 border-0 md:px-4">
      <div
        className="w-full h-full flex flex-row space-x-10 max-sm:flex-col justify-center border-0 max-sm:space-x-0 max-sm:space-y-4
        md:space-x-4 max-sm:px-2 max-sm:items-center"
      >
        <div
          className="w-full max-sm:w-full flex flex-row max-sm:flex-col max-sm:space-y-0 space-x-4 bg-linear-to-r from-[#E4E8F6] to-[#B6C1E7]
          rounded-md pr-8 max-sm:pr-0"
        >
          <div className="w-96 flex flex-col gap-4 md:w-64 h-full rounded-md max-sm:w-full max-sm:h-60 border-0 px-4 py-4">
            {selectedItem?.imageUrl && (
              <div className="flex items-center justify-center">
                <div className="w-56 h-56 bg-accent overflow-hidden rounded-md border">
                  <Image
                    src={
                      selectedItem?.imageUrl[imageIdx] ??
                      selectedItem.imageUrl[0]
                    }
                    alt={selectedItem?.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            {selectedItem?.colours && (
              <div className="flex flex-row gap-2">
                {selectedItem.colours.map((colour, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    style={{ backgroundColor: colour }}
                    className={`w-10 cursor-pointer border ${imageIdx === idx ? "ring-2 ring-blue-400 shadow-lg" : ""}`}
                    onClick={() => handleImageColour(idx)}
                  ></Button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4 py-4 px-4 border-0">
            <h2 className="font-semibold text-2xl text-black">
              {selectedItem?.name}
            </h2>

            <div className="w-full flex flex-col space-y-1 py-2 border-0">
              <p className="text-sm">Product code: </p>
              {selectedItem?.price && (
                <p className="font-bold">
                  <ProductPrice yuanPrice={selectedItem?.price} />
                </p>
              )}
            </div>

            {/* {selectedItem?.size ? <p>Size: </p> : null} */}

            <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
              <p>Quantity:</p>

              <div className="w-fit flex flex-row space-x-2 items-center">
                <MinusIcon
                  className="h-6 w-6 text-blue-950 border rounded-full p-1 cursor-pointer bg-white"
                  onClick={() => setqty((prev) => (prev > 1 ? prev - 1 : 1))}
                />
                <span className="px-2">{qty}</span>
                <PlusIcon
                  className="h-6 w-6 text-blue-950 border rounded-full p-1 cursor-pointer bg-white"
                  onClick={() => setqty((prev) => prev + 1)}
                />
              </div>
            </div>

            <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
              <Button
                variant="outline"
                className="bg-[#334EAC] text-white font-semibold cursor-pointer"
              >
                Purchase
              </Button>
              <AddToCart data={selectedItem} />
            </div>
          </div>
        </div>
        <div
          className="w-full border-0 px-4 max-sm:px-2 rounded-md bg-linear-to-r from-[#E4E8F6] to-[#B6C1E7]
          max-sm:pb-4 overflow-y-scroll"
        >
          <h1 className="font-semibold text-lg py-4">Product Description</h1>
          <p className="text-base font-light text-black leading-7 mb-4">
            {selectedItem?.description}
          </p>

          <p className="text-base font-normal text-black leading-7">
            For special orders, please note that a special shipping fee will
            apply to ensure expedited processing and delivery.
          </p>

          <p className="pt-4 text-base font-normal text-black leading-7">
            If you have any questions or require further assistance with your
            order, feel free to contact our customer support team. Enjoy your
            shopping experience with Fourth View.
          </p>
        </div>
      </div>
    </div>
  );
}
