"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NormalizedProduct } from "@/types/product";
import SearchBar from "@/components/shop/SearchBar";
import SearchResults from "@/components/shop/SearchResults";
import ShopByCategory from "@/components/ShopWithUs/ShopByCategory";
import TopPicks from "@/components/ShopWithUs/TopPicks";
import OnSale from "@/components/ShopWithUs/OnSale";
import AudienceBanner from "@/components/AudienceBanner";
import Banner from "@/components/ShopWithUs/Banner";
import BannerOverlay from "@/components/ShopWithUs/BannerOverlay";
import shopBanner from "@/public/shopBanner.png";

interface Props {
  products: NormalizedProduct[];
}

export default function ShopPage({ products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL is the single source of truth — no local state needed
  const activeQuery = searchParams.get("q") ?? "";
  const isSearching = activeQuery.trim().length > 0;

  const filteredProducts = useMemo(() => {
    if (!activeQuery.trim()) return [];
    const q = activeQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeQuery, products]);

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      router.push(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const handleClear = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <section className="flex flex-col w-full items-center border-0 space-y-4 relative">
      <Banner
        banner={shopBanner}
        topRight={
          <SearchBar
            initialQuery={activeQuery}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        }
      />
      <BannerOverlay />
      <AudienceBanner />

      <AnimatePresence>
        {isSearching && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm overflow-y-auto pt-32 pb-12 px-4"
          >
            <SearchResults
              query={activeQuery}
              products={filteredProducts}
              onClear={handleClear}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isSearching && (
        <>
          <ShopByCategory />
          <TopPicks products={products} />
          <OnSale products={products} />
        </>
      )}
    </section>
  );
}
