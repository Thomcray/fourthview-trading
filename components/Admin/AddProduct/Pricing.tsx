import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type ProductType = {
  product?: {
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
  } | null;
};
export default function Pricing({ product }: ProductType) {
  return (
    <div className="w-full flex flex-col gap-4 max-sm:px-4">
      <h2 className="text-base text-black">Pricing</h2>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Base Price (&yen;)
        {product?.price ? (
          <Input
            type="number"
            name="price"
            defaultValue={product?.price ? product.price : ""}
            placeholder="0.00"
            className="py-6 px-4"
            required
          />
        ) : (
          <Input
            type="number"
            name="price"
            placeholder="0.00"
            className="py-6 px-4"
            required
          />
        )}
      </Label>

      <div className="flex flex-row gap-4 items-center border-0">
        <Label className="w-full text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
          Discount %
          <Input
            type="number"
            name="discount"
            defaultValue={product?.discount ? product.discount : ""}
            placeholder="10"
            className="py-6 px-4"
          />
        </Label>

        <Label className="w-full text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
          Discount Type
          <Input
            type="text"
            defaultValue={product?.discountType ? product.discountType : ""}
            name="discountType"
            placeholder=""
            className="py-6 px-4"
          />
        </Label>
      </div>
    </div>
  );
}
