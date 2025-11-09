import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type GeneralInformationProductType = {
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
export default function GeneralInformation({
  product,
}: GeneralInformationProductType) {
  return (
    <div className="w-full flex flex-col gap-4 max-sm:px-4">
      <h2 className="text-base text-black">General Information</h2>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Product Name
        <Input
          type="text"
          name="productName"
          defaultValue={product?.name}
          placeholder="Product name"
          className="py-6 px-4"
          required
        />
      </Label>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Description
        <Textarea
          name="description"
          defaultValue={product?.description}
          placeholder="Product description"
          className="py-6 px-4"
          required
        />
      </Label>
    </div>
  );
}
