import React from "react";
import UpdateForm from "./UpdateForm";
import Category from "./Category";
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
  weight: number;
  shippingCost: number;
};
export default async function UpdateProduct({ params }: Params) {
  const getParams = await params;
  const product: Product | null = await getProductById(
    Number(getParams.productId)
  );

  console.log(product);

  return (
    <div className="w-full flex flex-col space-y-4 border-0">
      <UpdateForm product={product}>
        <Category product={product} />
      </UpdateForm>
    </div>
  );
}
