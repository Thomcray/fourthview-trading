"use client";

import AddToCart from "@/components/AddToCart";
import { useApp } from "@/components/AppContext";
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
  sizes: string[];
  weight: string;
  shippingCost: number;
};

type SelectedItem = Item | undefined | null;

type ViewProductProps = {
  selectedItem: SelectedItem;
};
export default function ViewProduct({ selectedItem }: ViewProductProps) {
  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const { cart, updateQuantity } = useApp();

  const inCart = cart.find((item) => item.itemName === selectedItem?.name);

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

  const handleQuantityChange = (newQty: number) => {
    if (!inCart || !selectedItem) return;

    // Ensure quantity is at least 1
    const validQty = Math.max(1, newQty);
    updateQuantity(selectedItem.name, validQty);
  };

  const handleIncrement = () => {
    if (inCart) {
      handleQuantityChange((inCart.quantity || 1) + 1);
    } else {
      setQty((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (inCart) {
      handleQuantityChange((inCart.quantity || 1) - 1);
    } else {
      setQty((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  if (!selectedItem) return null;
  return (
    <div className="flex flex-col px-12 py-10 w-full h-full max-sm:h-full max-sm:px-0 space-y-4 border-0 md:px-4">
      <div
        className="w-full h-full flex flex-row space-x-10 lg:flex-row max-sm:flex-col md:flex-col justify-center border-0 max-sm:space-x-0 max-sm:space-y-4
        md:space-x-4 max-sm:px-2 max-sm:items-center"
      >
        <div
          className="w-full max-sm:w-full flex flex-row max-sm:flex-col max-sm:gap-y-10 space-x-4 bg-linear-to-r from-[#E4E8F6] to-[#B6C1E7]
          pr-8 max-sm:pr-0 border-0"
        >
          <div className="w-96 flex flex-col gap-4 md:w-64 h-full rounded-md max-sm:w-full max-sm:h-60 border-0 px-4 py-4">
            {selectedItem?.imageUrl && (
              <div className="flex items-center justify-center">
                <div className="w-56 h-56 max-sm:w-full  bg-accent overflow-hidden border-0">
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

          <div className="w-full flex flex-col space-y-4 py-4 px-0 border-0">
            <div className="w-full flex flex-col space-y-1 pb-1.5 border-b max-sm:px-4 border-slate-200">
              <h2 className="font-light text-lg text-black">
                {selectedItem?.name}
              </h2>

              {/* <p className="text-sm">Product code: </p> */}
              {selectedItem?.price && (
                <p className="text-xl">
                  <ProductPrice yuanPrice={selectedItem?.price} />
                </p>
              )}
            </div>

            {selectedItem?.weight && (
              <div className="w-fit max-sm:w-full flex flex-row items-center gap-0.5 py-0.5 px-2 border-0">
                <div className="w-fit flex flex-row items-center gap-0.5 py-0.5 px-2 rounded-xl bg-black">
                  <p className="text-xs text-white">product weigh</p>
                  <span className="font-normal text-xs text-white border-0">
                    {selectedItem.weight} kg
                  </span>
                </div>
                <p className="text-xs text-black w-fit">
                  + shipping{" "}
                  <ProductPrice yuanPrice={selectedItem.shippingCost} />
                </p>
              </div>
            )}

            <div className="w-full flex flex-col gap-1 py-2 max-sm:px-2 border-0">
              {selectedItem?.sizes && (
                <div className="flex flex-col py-1 gap-1 border-0">
                  <h1 className="font-normal text-base">Available Size(s)</h1>

                  <div className="flex flex-row gap-1">
                    {selectedItem.sizes.map((size, idx) => (
                      <Button
                        variant="outline"
                        key={idx}
                        className="text-sm border px-2 py-2 cursor-pointer rounded-none bg-accent"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {inCart && (
                <div className="w-fit flex flex-row space-x-1 items-center">
                  <MinusIcon
                    className="h-6 w-6 text-blue-950 border rounded-md p-1 cursor-pointer bg-white"
                    onClick={handleDecrement}
                  />
                  <span className="px-2">
                    {inCart.quantity ? inCart.quantity : qty}
                  </span>
                  <PlusIcon
                    className="h-6 w-6 text-blue-950 border rounded-md p-1 cursor-pointer bg-white"
                    onClick={handleIncrement}
                  />
                </div>
              )}
            </div>

            <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
              <AddToCart data={selectedItem} />
            </div>
          </div>
        </div>
        <div className="w-full border px-4 max-sm:px-2 rounded-md bg-white max-sm:pb-4 overflow-y-auto">
          <h1 className="font-semibold text-lg py-4">Product Description</h1>

          <div className="border-0 px-2 py-2">
            <p className="text-base font-light text-black leading-7 mb-4">
              {selectedItem?.description}
            </p>
          </div>

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
