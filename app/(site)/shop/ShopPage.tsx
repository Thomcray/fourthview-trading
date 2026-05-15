"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, NormalizedProduct } from "@/types/product";
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
  initialQuery: string;
  products: Product[];
}

function deriveSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export default function ShopPage({ initialQuery, products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Normalize products with slug and group keys
  const normalizedProducts = useMemo<NormalizedProduct[]>(() => {
    return products.map((p) => ({
      ...p,
      slug: deriveSlug(p.name),
      _groupKeys: {
        byProductType: (p.productType ?? "Other").toLowerCase().trim(),
        byTarget: (p.target ?? "General").toLowerCase().trim(),
      },
    }));
  }, [products]);

  const [activeQuery, setActiveQuery] = useState(initialQuery);

  // Sync with URL changes (back/forward)
  useEffect(() => {
    const queryFromUrl = searchParams.get("q") ?? "";
    if (queryFromUrl !== activeQuery) {
      setActiveQuery(queryFromUrl);
    }
  }, [searchParams, activeQuery]);

  const filteredProducts = useMemo(() => {
    if (!activeQuery.trim()) return [];
    const q = activeQuery.toLowerCase();
    return normalizedProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeQuery, normalizedProducts]);

  const isSearching = activeQuery.trim().length > 0;

  const handleSearch = useCallback(
    (query: string) => {
      setActiveQuery(query);
      const params = new URLSearchParams();
      params.set("q", query);
      router.push(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleClear = useCallback(() => {
    setActiveQuery("");
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
          <TopPicks products={normalizedProducts} />
          <OnSale products={normalizedProducts} />
        </>
      )}
    </section>
  );
}
