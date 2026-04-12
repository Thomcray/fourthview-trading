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
    <div className="w-full flex flex-col gap-6 max-sm:px-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">
          General Information
        </h2>
        <p className="text-xs text-slate-400">
          Basic details about your product
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <Label className="text-sm text-slate-500 flex flex-col gap-1.5 text-left font-light">
          Product Name
          <span className="text-red-400 text-xs">* Required</span>
          <Input
            type="text"
            name="productName"
            defaultValue={product?.name}
            placeholder="e.g. Nike Air Force 1, Modern Sofa Set..."
            className="py-6 px-4 text-slate-800 placeholder:text-slate-300"
            required
          />
          <span className="text-xs text-slate-400">
            Use a clear, descriptive name that customers can easily search for
          </span>
        </Label>

        <Label className="text-sm text-slate-500 flex flex-col gap-1.5 text-left font-light">
          Description
          <span className="text-red-400 text-xs">* Required</span>
          <Textarea
            name="description"
            defaultValue={product?.description}
            placeholder="Describe the product — materials, features, dimensions, use case..."
            className="min-h-32 px-4 py-3 text-slate-800 placeholder:text-slate-300 resize-y"
            required
          />
          <span className="text-xs text-slate-400">
            A good description helps customers make informed purchase decisions
          </span>
        </Label>
      </div>
    </div>
  );
}
