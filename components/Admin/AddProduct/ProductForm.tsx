"use client";

import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/app/_lib/actions/product-actions";
import GeneralInformation from "./GeneralInformation";
import ProductMedia from "./ProductMedia";
import Pricing from "./Pricing";

export default function ProductForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);

    startTransition(async () => {
      try {
        await createProduct(formData);
        toast.success("Product created successfully!");

        // reset form after product is created
        form.reset();
        // reset error state if error
        error && setError("");
      } catch (error) {
        setError("File must be an image and less than 2MB");
        toast.error((error as Error).message);
      }
    });
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleProduct}>
      <div
        className="w-full flex flex-row max-sm:flex-col max-sm:items-baseline justify-between lg:items-center 
            md:items-center py-4 px-4 border rounded-md"
      >
        <h1 className="text-xl text-black text-left">Add Product</h1>

        <div className="flex flex-row gap-4">
          <Button variant="destructive" type="button">
            Discard Changes
          </Button>
          <Button variant="outline" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="w-full bg-red-400 flex flex-row max-sm:flex-col max-sm:items-baseline py-4 px-4 border rounded-md">
          <p className="text-base text-white">{error}</p>
        </div>
      )}

      <div
        className="w-full lg:h-60 flex flex-row max-sm:flex-col justify-between items-center gap-4 py-4 
            px-4 border rounded-md"
      >
        <GeneralInformation />
        <ProductMedia />
      </div>

      <div className="w-full lg:h-60 flex flex-row max-sm:flex-col justify-between items-center gap-4 py-4 px-4 border rounded-md">
        <Pricing />
        {children}
      </div>
    </form>
  );
}
