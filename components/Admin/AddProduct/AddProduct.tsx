// components/Admin/AddProduct/AddProduct.tsx
"use client";

import Link from "next/link";
import Category from "./Category";
import ProductForm from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AddProduct() {
  const [productType, setProductType] = useState<string>("");

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-end">
            <Link href="/admin/view-products">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Form */}
        <ProductForm>
          {(productType: string) => {
            setProductType(productType);
            return <Category productType={productType} />;
          }}
        </ProductForm>
      </div>
    </div>
  );
}
