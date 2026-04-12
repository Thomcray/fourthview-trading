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

  const selectedItem = products.find((item) => item.id === Number(itemId));

  return (
    <section className="w-full h-full overflow-y-scroll space-y-6 flex flex-col items-center border-0 px-8 sm:px-2 py-8 max-sm:px-4">
      <ViewProduct selectedItem={selectedItem} />
      <ItemDescTab />
      <SimilarItems selectedItem={selectedItem} />
    </section>
  );
}
