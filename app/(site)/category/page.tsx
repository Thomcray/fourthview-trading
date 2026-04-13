// app/shop/page.tsx
import Banner from "@/components/ShopWithUs/Banner";
import React from "react";
import shopBanner from "@/public/shopBanner.png";
import Category from "@/components/CategorySection/Category";

export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Banner banner={shopBanner} />

      {/* Decorative separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center -mt-6">
          <div className="bg-white px-4 py-2 rounded-full shadow-md">
            <span className="text-blue-600 text-sm font-medium">
              Shop by Category
            </span>
          </div>
        </div>
      </div>

      <div className="pt-12 pb-16">
        <Category />
      </div>
    </main>
  );
}
