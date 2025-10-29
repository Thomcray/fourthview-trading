import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function GeneralInformation() {
  return (
    <div className="w-full flex flex-col gap-4 max-sm:px-4">
      <h2 className="text-base text-black">General Information</h2>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Product Name
        <Input
          type="text"
          name="productName"
          placeholder="Product name"
          className="py-6 px-4"
          required
        />
      </Label>

      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Description
        <Textarea
          name="description"
          placeholder="Product description"
          className="py-6 px-4"
          required
        />
      </Label>
    </div>
  );
}
