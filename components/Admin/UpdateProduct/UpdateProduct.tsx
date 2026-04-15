import React from "react";
import UpdateForm from "./UpdateForm";
import { getProductById } from "@/app/_lib/data-services";

type Params = {
  params: { productId: string };
};

type Product = {
  id: number;
  name: string;
  description: string;
  productType: string;
  colours: string[];
  price: number;
  discount: number;
  discountType: string;
  categoryId: number;
  target: string;
  imageUrl: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
};

export default async function UpdateProduct({ params }: Params) {
  const getParams = await params;
  const product: Product | null = await getProductById(
    Number(getParams.productId),
  );

  if (!product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UpdateForm product={product} />
    </div>
  );
}
