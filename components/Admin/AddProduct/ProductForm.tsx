"use client";

import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/app/_lib/actions/product-actions";
import GeneralInformation from "./GeneralInformation";
import ProductMedia from "./ProductMedia";
import Pricing from "./Pricing";
import OtherInformation from "./OtherInformation";
import AvailableColours from "./AvailableColours";
import { AlertCircle, PackagePlus, Trash2 } from "lucide-react";

export default function ProductForm({
  children,
}: {
  children: React.ReactNode | ((productType: string) => React.ReactNode);
}) {
  const [productType, setProductType] = useState("");
  const [colours, setColours] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);

    startTransition(async () => {
      try {
        await createProduct(formData, colours, images);
        toast.success("Product created successfully!");
        form.reset();
        setColours([]);
        setImages([]);
        if (error) setError("");
      } catch (error) {
        setError("File must be an image and less than 2MB");
        toast.error((error as Error).message);
      }
    });
  };

  const handleDiscard = () => {
    setColours([]);
    setImages([]);
    setError("");
    const form = document.querySelector("form");
    form?.reset();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleProduct}>
      {/* Header */}
      <div className="w-full flex flex-row max-sm:flex-col max-sm:gap-3 justify-between items-center py-4 px-5 border rounded-xl bg-white shadow-sm">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-semibold text-slate-800">Add Product</h1>
          <p className="text-xs text-slate-400">
            Fill in the details below to list a new product
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={handleDiscard}
            className="flex items-center gap-1.5 text-slate-500 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-800 text-white cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            {isPending ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 flex flex-row items-center gap-3 py-3 px-4 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* General info + media */}
      <div className="w-full flex flex-col gap-6 py-6 px-5 border rounded-xl bg-white shadow-sm">
        <GeneralInformation />
        <div className="border-t pt-6">
          <ProductMedia
            images={images}
            setImages={setImages}
            existingImages={[]}
          />
        </div>
      </div>

      {/* Other information */}
      <div className="w-full py-6 px-5 border rounded-xl bg-white shadow-sm">
        <OtherInformation isUpdatePage={false} onTypeChange={setProductType}>
          <AvailableColours colours={colours} setColours={setColours} />
        </OtherInformation>
      </div>

      {/* Pricing + category */}
      <div className="w-full flex flex-row max-sm:flex-col gap-6 py-6 px-5 border rounded-xl bg-white shadow-sm">
        <Pricing />
        <div className="border-l max-sm:border-l-0 max-sm:border-t pl-6 max-sm:pl-0 max-sm:pt-6 flex-1">
          {typeof children === "function" ? children(productType) : children}
        </div>
      </div>
    </form>
  );
}
