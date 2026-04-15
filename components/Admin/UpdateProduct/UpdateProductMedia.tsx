"use client";

import { deleteExistingImage } from "@/app/_lib/actions/update-product-action";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useUpdateForm } from "./UpdateForm"; // ← added

export default function UpdateProductMedia() {
  const { images, setImages, existingImages, setExistingImages, product } =
    useUpdateForm();

  const [_isPending, startTransition] = useTransition();
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const imageExists = images.some((image) => image.name === files[0]?.name);

    if (imageExists) {
      toast.error("Image already added");
      e.target.value = "";
      return;
    }
    setImages([...images, ...files]);
    e.target.value = "";
  };

  const removeImage = (imageToRemove: File) => {
    setImages(images.filter((file) => file !== imageToRemove));
  };

  const removeExistingImage = (url: string) => {
    setDeletingImage(url);
    startTransition(async () => {
      try {
        await deleteExistingImage(url, product?.id);
        setExistingImages(existingImages.filter((file) => file !== url));
        toast.success("Image deleted successfully");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setDeletingImage(null);
      }
    });
  };

  const totalImages = existingImages.length + images.length;

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">Product Media</h2>
        <p className="text-xs text-slate-400">
          Upload clear product images. Each image must be under 2MB.
        </p>
      </div>

      <label
        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 
        rounded-xl py-10 px-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <ImagePlus className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">
            Click to upload images
          </p>
          <p className="text-xs text-slate-400">
            PNG, JPG, WEBP, AVIF — max 2MB each
          </p>
        </div>
        <Input
          type="file"
          multiple
          name="productImages"
          accept="image/*"
          onChange={handleImageChange}
          required={images.length === 0 && existingImages.length === 0}
          className="hidden"
        />
      </label>

      {totalImages > 0 && (
        <p className="text-xs text-slate-400">
          {totalImages} image{totalImages > 1 ? "s" : ""} added
        </p>
      )}

      {existingImages?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500">
            Existing {existingImages.length > 1 ? "Images" : "Image"}
          </p>
          <div className="grid grid-cols-4 max-sm:grid-cols-3 gap-2">
            {existingImages.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border bg-slate-50"
              >
                <Image
                  src={url}
                  alt={`Existing image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center shadow cursor-pointer transition-colors"
                >
                  {deletingImage === url ? (
                    <span className="text-[8px] text-slate-500">...</span>
                  ) : (
                    <X size={12} className="text-slate-700" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500">
            New {images.length > 1 ? "Images" : "Image"}
          </p>
          <div className="grid grid-cols-4 max-sm:grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border bg-slate-50"
              >
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`New image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {parseFloat((image.size / (1024 * 1024)).toFixed(2))} MB
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center shadow cursor-pointer transition-colors"
                >
                  <X size={12} className="text-slate-700" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
