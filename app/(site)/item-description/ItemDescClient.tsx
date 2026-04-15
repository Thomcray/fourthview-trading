"use client";

import ItemDescTab from "@/components/ItemDescTab";
import SimilarItems from "@/components/SimilarItems";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppContext";
import ViewProduct from "./ViewProduct";

export default function ItemDescriptionClient() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");

  const { allProducts: products } = useApp();

  const foundItem = products.find((item) => item.id === Number(itemId));

  // Handle case when product is not found
  if (!foundItem) {
    return (
      <section className="w-full h-full overflow-y-scroll space-y-6 flex flex-col items-center border-0 px-8 sm:px-2 py-8 max-sm:px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </section>
    );
  }

  // Transform the product to ensure target is a string (not null)
  const selectedItem = {
    ...foundItem,
    target: foundItem.target || "", // Convert null to empty string
  };

  return (
    <section className="w-full h-full overflow-y-scroll space-y-6 flex flex-col items-center border-0 px-8 sm:px-2 py-8 max-sm:px-4">
      <ViewProduct selectedItem={selectedItem} />
      <ItemDescTab />
      <SimilarItems selectedItem={selectedItem} />
    </section>
  );
}
