import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function ProductMedia() {
  return (
    <div className="w-92 max-sm:w-full flex lg:h-full flex-col gap-4 px-4 border-0">
      <h2 className="text-base text-black">Product Media</h2>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Image
        <div className="py-8 px-4 flex items-center border border-dashed rounded-md">
          <Input
            type="file"
            name="productImage"
            placeholder="Upload"
            className=""
            accept="image/*"
            required
          />
        </div>
      </Label>
    </div>
  );
}
