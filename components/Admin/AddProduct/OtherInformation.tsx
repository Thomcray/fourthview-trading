import { Label } from "@/components/ui/label";
import Selection from "@/components/Selection";
import React from "react";

type OtherInformationProps = {
  productType?: string;
  children: React.ReactNode;
};
export default function OtherInformation({
  productType,
  children,
}: OtherInformationProps) {
  return (
    <div className="w-full flex flex-col gap-4 max-sm:px-4">
      <h2 className="text-base text-black">Other Information</h2>

      <div className="w-full flex flex-col gap-4 border-0">
        <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
          <Selection
            defaultValue={productType ? productType : "Select Type"}
            name="type"
            width="w-96 max-sm:w-full"
            required={false}
          >
            {["Shirt", "Trouser", "Shoes", "Jewelry"]?.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Selection>
        </Label>

        <div className="w-full border-0">
          <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
            Available Colours
            {children}
          </Label>
        </div>
      </div>
    </div>
  );
}
