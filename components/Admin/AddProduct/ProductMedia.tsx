"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";

type ImageType = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};
export default function ProductMedia({ images, setImages }: ImageType) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const imageExists = images.some((image) => image.name === files[0]?.name);

    if (imageExists) {
      toast.error("Image already added");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    // e.target.value = "";
  };

  const removeImage = (imageToRemove: File) => {
    setImages((prev) => prev.filter((file) => file !== imageToRemove));
  };
  return (
    <div className="w-full max-sm:w-full flex lg:h-full flex-col gap-4 px-4 border-0">
      <h2 className="text-base text-black">Product Media</h2>
      <p className="text-orange-500 text-base font-light">
        <span className="font-bold">Note:</span> Image must be less than 2MB
      </p>
      <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
        Image (Add multiple...)
        <div className="py-8 px-4 flex items-center border border-dashed rounded-md">
          <Input
            type="file"
            multiple
            name="productImages"
            placeholder="Upload"
            className=""
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
      </Label>

      {/* Preview Images */}

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 w-full">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex flex-row gap-2 w-full aspect-square rounded-md overflow-hidden"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`Preview ${image} - {index}`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <span className="text-slate-500 text-xs absolute">
                {/* convert to bytes */}
                {parseFloat((image.size / (1024 * 1024)).toFixed(2))} MB
              </span>

              <Button
                variant="ghost"
                className="absolute right-0 bg-white/50 hover:white text-black w-max cursor-pointer border"
                onClick={() => removeImage(image)}
              >
                <X size={14} className="text-black hover:text-black" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
