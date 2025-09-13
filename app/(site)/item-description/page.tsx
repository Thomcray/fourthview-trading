"use client";

import categories from "@/components/CategorySection/categoryList";
import ItemDescTab from "@/components/ItemDescTab";
import SimilarItems from "@/components/SimilarItems";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  itemName: string;
  image: StaticImageData;
}
export default function page() {
  const [selectedItem, setSelectedItem] = useState<Category[] | null>(null);
  const [value, setValue] = useState(1);
  const searchParams = useSearchParams();

  const item = searchParams.get("q");
  const category = searchParams.get("category");

  useEffect(() => {
    if (item && category) {
      try {
        const getCategory =
          categories.categories[category as keyof typeof categories.categories];

        if (getCategory) {
          const foundItem = getCategory.filter((it) => it.itemName === item);
          setSelectedItem(foundItem);
        } else {
          console.log("Category not found");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [category]);

  return (
    <section className="w-full h-full overflow-y-scroll space-y-6 flex flex-col items-center border-0 px-8 sm:px-2 py-8 max-sm:px-4">
      <div className="flex flex-col px-12 w-full h-full max-sm:h-full max-sm:px-0 space-y-4 border-0 md:px-4 ">
        {selectedItem?.map((item) => (
          <div
            key={item.id}
            className="w-full h-full flex flex-row space-x-10 max-sm:flex-col justify-center border-0 max-sm:space-x-0 max-sm:space-y-4 
            md:space-x-4 max-sm:px-2 max-sm:items-center"
          >
            <div
              className="w-full max-sm:w-full flex flex-row max-sm:flex-col max-sm:space-y-0 space-x-4 bg-linear-to-r from-[#E4E8F6] to-[#B6C1E7] 
                rounded-md pr-8 max-sm:pr-0"
            >
              <div className="w-96 md:w-64 h-full rounded-md max-sm:w-full max-sm:h-60 border-0 px-4 py-4">
                <Image
                  src={item.image}
                  alt={item.itemName}
                  className="w-full max-sm:h-full rounded-md border-0"
                />
              </div>

              <div className="flex flex-col space-y-4 py-4 px-4 border-0">
                <h2 className="font-semibold text-2xl text-black">
                  {item.itemName}
                </h2>

                <div className="w-full flex flex-col space-y-1 py-2 border-0">
                  <p className="text-sm">Product code: </p>
                  <p className="font-bold">$20</p>
                </div>

                <p>Size: </p>

                <div className="w-full flex flex-row space-x-2 py-2 max-sm:px-2 border-0">
                  <p>Quantity:</p>

                  <div className="w-fit flex flex-row space-x-2 items-center">
                    <MinusIcon
                      className="h-6 w-6 text-blue-950 border rounded-full p-1 cursor-pointer bg-white"
                      onClick={() =>
                        setValue((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                    />
                    <span className="px-2">{value}</span>
                    <PlusIcon
                      className="h-6 w-6 text-blue-950 border rounded-full p-1 cursor-pointer bg-white"
                      onClick={() => setValue((prev) => prev + 1)}
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
                  <Button variant="outline" className="cursor-pointer px-4">
                    <ShoppingCart color="#334EAC" />
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="w-full border-0 px-4 max-sm:px-2 rounded-md bg-linear-to-r from-[#E4E8F6] to-[#B6C1E7] 
              max-sm:pb-4"
            >
              <h1 className="font-semibold text-lg py-4">
                Product Description
              </h1>

              <p className="text-base font-normal text-black leading-7">
                For special orders, please note that a special shipping fee will
                apply to ensure expedited processing and delivery.
              </p>

              <p className="pt-4 text-base font-normal text-black leading-7">
                If you have any questions or require further assistance with
                your order, feel free to contact our customer support team.
                Enjoy your shopping experience with Fourth View.
              </p>
            </div>
          </div>
        ))}
      </div>
      <ItemDescTab />
      <SimilarItems />
    </section>
  );
}
