"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import GeneralInformation from "./GeneralInformation";
import ProductMedia from "./ProductMedia";
import OtherInformation from "./OtherInformation";
import AvailableColours from "./AvailableColours";
import Pricing from "./Pricing";
import { updateProduct } from "@/app/_lib/actions/update-product-action";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

type UpdateProductFormProps = {
  product: {
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
  } | null;
  children: React.ReactNode;
};
export default function UpdateForm({
  product,
  children,
}: UpdateProductFormProps) {
  const [colours, setColours] = useState<string[]>(product?.colours || []);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.imageUrl || [],
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    startTransition(async () => {
      try {
        // updateProduct function to be implemented
        if (product)
          await updateProduct(product?.id, formData, colours, images);
        toast.success("Product updated successfully!");
      } catch (error) {
        setError("File must be an image and less than 2MB");
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleUpdateProduct}>
      <div
        className="w-full flex flex-row max-sm:flex-col max-sm:items-baseline gap-4 lg:items-center 
            md:items-center py-4 px-4 border rounded-md"
      >
        <div className="flex flex-row gap-4">
          <Button variant="outline" type="button" className="cursor-pointer">
            <ArrowLeft /> Back
          </Button>
        </div>

        <h1 className="text-xl text-black text-left">Update Product</h1>
      </div>

      {error && (
        <div className="w-full bg-red-400 flex flex-row max-sm:flex-col max-sm:items-baseline py-4 px-4 border rounded-md">
          <p className="text-base text-white">{error}</p>
        </div>
      )}

      <div
        className="w-full flex flex-col justify-between items-center gap-4 py-4 
            px-4 border rounded-md"
      >
        <GeneralInformation product={product} />
        <ProductMedia
          images={images}
          setImages={setImages}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          productId={product?.id || 0}
        />
      </div>

      <div className="w-full flex flex-row max-sm:flex-col justify-between items-center gap-4 py-4 px-4 border rounded-md">
        {/* other information */}
        {product && (
          <OtherInformation
            productType={product?.productType || ""}
            productWeight={product?.weight}
            shippingCost={product?.shippingCost}
            selectedSizes={product?.sizes}
            isUpdatePage={true}
          >
            <AvailableColours colours={colours} setColours={setColours} />
          </OtherInformation>
        )}
      </div>

      <div className="w-full lg:h-60 flex flex-row max-sm:flex-col justify-between items-center gap-4 py-4 px-4 border rounded-md">
        <Pricing product={product} />
        {children}
      </div>

      <div className="w-full flex flex-row gap-4">
        <Button
          variant="outline"
          type="submit"
          disabled={isPending}
          className="w-full h-12 cursor-pointer bg-blue-500 text-white text-md"
        >
          {isPending ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
