import { notFound } from "next/navigation";
import { getAllProducts } from "@/app/_lib/data-services";
import { normalizeProducts } from "@/lib/product";
import ShopPage from "./ShopPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const rawProducts = await getAllProducts();
  if (!rawProducts?.length) notFound();

  const products = normalizeProducts(rawProducts);

  return <ShopPage products={products} />;
}
