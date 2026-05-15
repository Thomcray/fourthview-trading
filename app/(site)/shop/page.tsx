import { notFound } from "next/navigation";
import { getAllProducts } from "@/app/_lib/data-services";
import ShopPage from "./ShopPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getAllProducts();

  if (!products) notFound();

  return <ShopPage initialQuery={q ?? ""} products={products} />;
}
