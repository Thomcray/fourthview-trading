// app/special-order/page.tsx
"use client";

import { specialOrders } from "@/app/_lib/actions/special-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useTransition, useCallback } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function SpecialOrders() {
  const [orderImages, setOrderImages] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const MAX_IMAGES = 2;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const validateImage = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not an image file`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 2MB limit`);
      return false;
    }
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    files.forEach((file) => {
      if (!validateImage(file)) return;

      if (orderImages.length >= MAX_IMAGES) {
        toast.warning(`Maximum of ${MAX_IMAGES} images only`);
        return;
      }

      if (orderImages.some((img) => img.name === file.name)) {
        toast.error(`${file.name} already added`);
        return;
      }

      setOrderImages((prev) => [...prev, file]);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setOrderImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image removed");
  };

  const clearAllImages = () => {
    setOrderImages([]);
    toast.info("All images cleared");
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        if (!validateImage(file)) return;

        if (orderImages.length >= MAX_IMAGES) {
          toast.warning(`Maximum of ${MAX_IMAGES} images only`);
          return;
        }

        if (orderImages.some((img) => img.name === file.name)) {
          toast.error(`${file.name} already added`);
          return;
        }

        setOrderImages((prev) => [...prev, file]);
      });
    },
    [orderImages],
  );

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const description = formData.get("description") as string;

    if (!description?.trim()) {
      toast.error("Please provide an order description");
      return;
    }

    startTransition(async () => {
      try {
        await specialOrders(formData, userId, orderImages);
        toast.success("Your order has been sent successfully!");

        // Reset form
        form.reset();
        setOrderImages([]);
        setError("");
      } catch (error) {
        const errorMessage = (error as Error).message;
        setError(errorMessage);
        toast.error(
          errorMessage || "Failed to submit order. Please try again.",
        );
      }
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">
            Special Orders & Enquiries
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a special request? Let us know and we'll get back to you within
            24 hours
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form className="p-6 sm:p-8 space-y-6" onSubmit={handleOrder}>
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Email Field - Readonly if logged in */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Email Address
                {!session?.user && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                type="email"
                name="email"
                defaultValue={session?.user?.email || ""}
                placeholder={!session?.user ? "your@email.com" : ""}
                className="py-6 px-4 bg-gray-50 border-gray-200 focus:bg-white"
                readOnly={!!session?.user}
                required={!session?.user}
              />
              {session?.user && (
                <p className="text-xs text-gray-500">
                  Using your registered email address
                </p>
              )}
            </div>

            {/* Order Description */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Order Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="description"
                placeholder="Describe your special order, request, or enquiry in detail..."
                className="min-h-[150px] resize-y p-4"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <div>
                <Label className="text-gray-700 font-medium">
                  Reference Images (Optional)
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Upload up to {MAX_IMAGES} images to help us understand your
                  request better
                </p>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-6 text-center
                  transition-all duration-200 cursor-pointer
                  ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 bg-gray-50"
                  }
                  ${orderImages.length >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <Input
                  type="file"
                  multiple
                  name="orderImages"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={orderImages.length >= MAX_IMAGES}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 2MB each
                </p>
                <p className="text-xs text-orange-500 mt-2">
                  ⚠️ Maximum {MAX_IMAGES} images
                </p>
              </div>

              {/* Image Preview Grid */}
              {orderImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {orderImages.length} of {MAX_IMAGES} images added
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAllImages}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <AnimatePresence>
                      {orderImages.map((image, index) => (
                        <motion.div
                          key={`${image.name}-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            {/* File Size Badge */}
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                              {(image.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Special Order
                </div>
              )}
            </Button>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500 pt-4 border-t">
              We'll review your request and get back to you within 24-48 hours
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
