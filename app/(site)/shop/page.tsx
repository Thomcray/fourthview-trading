import { notFound } from "next/navigation";
import { getAllProducts } from "@/app/_lib/data-services";
import SearchBar from "@/components/shop/SearchBar";
import SearchResults from "@/components/shop/SearchResults";
import ShopByCategory from "@/components/ShopWithUs/ShopByCategory";
import TopPicks from "@/components/ShopWithUs/TopPicks";
import OnSale from "@/components/ShopWithUs/OnSale";
import AudienceBanner from "@/components/AudienceBanner";
import Banner from "@/components/ShopWithUs/Banner";
import BannerOverlay from "@/components/ShopWithUs/BannerOverlay";
import shopBanner from "@/public/shopBanner.png";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = await getAllProducts();
  if (!products) notFound();

  const filteredProducts = query
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const isSearching = query.length > 0;

  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4">
      <Banner
        banner={shopBanner}
        topRight={<SearchBar initialQuery={query} />}
      />
      <BannerOverlay />
      <AudienceBanner />

      {isSearching ? (
        <SearchResults query={query} products={filteredProducts} />
      ) : (
        <>
          <ShopByCategory />
          <TopPicks products={products} />
          <OnSale products={products} />
        </>
      )}
    </section>
  );
}
