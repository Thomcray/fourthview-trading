"use client";

import { specialOrders } from "@/app/_lib/actions/special-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, AlertCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useTransition, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SPECIAL_ORDER_DEPOSIT = 50_000;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!;

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Paystack script")),
      );
      return;
    }

    const script = document.createElement("script");

    script.src = "https://js.paystack.co/v1/inline.js";

    script.onload = () => resolve();

    script.onerror = () => reject(new Error("Failed to load Paystack script"));

    document.body.appendChild(script);
  });
}

export default function SpecialOrders() {
  const [orderImages, setOrderImages] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const MAX_IMAGES = 2;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const router = useRouter();

  useEffect(() => {
    loadPaystackScript().catch(() => {});
  }, []);

  const validateImage = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not an image file`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 5MB limit`);
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

    if (!userId) {
      toast.error("Please sign in before submitting a special order.");
      return;
    }

    if (isPaymentLoading || isPending) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (!email?.trim()) {
      toast.error("Please provide your email address.");
      return;
    }

    if (!whatsapp?.trim()) {
      toast.error("Please provide your WhatsApp number.");
      return;
    }

    if (!description?.trim()) {
      toast.error("Please provide an order description.");
      return;
    }

    setError("");
    setIsPaymentLoading(true);

    try {
      await loadPaystackScript();

      /*
       * This reference belongs ONLY to this special-order deposit.
       * It is completely separate from the reference generated
       * by the normal cart checkout.
       */
      const reference = `SPECIAL-${Date.now()}-${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 12)}`;

      const handlePaymentSuccess = () => {
        startTransition(async () => {
          try {
            /*
             * The server action will independently verify this
             * reference with Paystack before creating the order.
             */
            await specialOrders(formData, userId, orderImages, reference);

            setIsPaymentLoading(false);

            toast.success(
              "Payment received! Your special order has been submitted successfully.",
              {
                autoClose: 2000,
                onClose: () => router.push("/"),
              },
            );

            form.reset();
            setOrderImages([]);
            setError("");
          } catch (error) {
            console.error("Special order submission failed:", error);

            const errorMessage =
              error instanceof Error
                ? error.message
                : "Payment was successful, but we could not submit your special order.";

            setError(errorMessage);
            setIsPaymentLoading(false);

            toast.error(errorMessage);
          }
        });
      };

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: SPECIAL_ORDER_DEPOSIT * 100,
        currency: "NGN",
        ref: reference,

        metadata: {
          custom_fields: [
            {
              display_name: "Payment Type",
              variable_name: "payment_type",
              value: "Special Order Refundable Deposit",
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${session?.user?.firstName ?? ""} ${
                session?.user?.lastName ?? ""
              }`.trim(),
            },
            {
              display_name: "WhatsApp",
              variable_name: "whatsapp",
              value: whatsapp,
            },
          ],
        },

        callback: () => {
          handlePaymentSuccess();
        },

        onClose: () => {
          setIsPaymentLoading(false);
          toast.info("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Special-order payment initialization failed:", error);

      setIsPaymentLoading(false);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start payment. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const isSubmitting = isPending || isPaymentLoading;

  return (
    <section className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-blue-900 sm:text-4xl">
            Special Orders & Enquiries
          </h1>

          <p className="mx-auto max-w-2xl text-gray-600">
            Have a special request? Let us know and we&apos;ll get back to you
            within 24 hours
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <form className="space-y-6 p-6 sm:p-8" onSubmit={handleOrder}>
            {/* Deposit Notice */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-blue-200 bg-blue-50 p-4"
            >
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>
                  <h3 className="font-semibold text-blue-900">
                    ₦50,000 Refundable Commitment Deposit
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-blue-800">
                    A refundable ₦50,000 deposit is required when submitting a
                    special order request. The deposit will be refunded when
                    your actual order is placed.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3"
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Email Address
                {!session?.user && <span className="ml-1 text-red-500">*</span>}
              </Label>

              <Input
                type="email"
                name="email"
                defaultValue={session?.user?.email || ""}
                placeholder={!session?.user ? "your@email.com" : ""}
                className="border-gray-200 bg-gray-50 px-4 py-6 focus:bg-white"
                readOnly={!!session?.user}
                required={!session?.user}
              />

              {session?.user && (
                <p className="text-xs text-gray-500">
                  Using your registered email address
                </p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                WhatsApp Number <span className="text-red-500">*</span>
              </Label>

              <Input
                type="tel"
                name="whatsapp"
                placeholder="+234 813 123 4567"
                className="border-gray-200 bg-gray-50 px-4 py-6 focus:bg-white"
                required
              />

              <p className="text-xs text-gray-500">
                We&apos;ll contact you on WhatsApp with updates on your order
              </p>
            </div>

            {/* Order Description */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Order Description <span className="text-red-500">*</span>
              </Label>

              <Textarea
                name="description"
                placeholder="Describe your special order, request, or enquiry in detail..."
                className="min-h-37.5 resize-y p-4"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <div>
                <Label className="font-medium text-gray-700">
                  Reference Images (Optional)
                </Label>

                <p className="mt-1 text-xs text-gray-500">
                  Upload up to {MAX_IMAGES} images to help us understand your
                  request better
                </p>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400"
                } ${
                  orderImages.length >= MAX_IMAGES
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                <Input
                  type="file"
                  multiple
                  name="orderImages"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={orderImages.length >= MAX_IMAGES}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                <Upload className="mx-auto mb-2 h-10 w-10 text-gray-400" />

                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB each
                </p>

                <p className="mt-2 text-xs text-orange-500">
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
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <AnimatePresence>
                      {orderImages.map((image, index) => (
                        <motion.div
                          key={`${image.name}-${index}`}
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                          }}
                          className="group relative"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 25vw"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="rounded-full bg-red-500 p-1.5 transition-colors hover:bg-red-600"
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </button>
                            </div>

                            {/* File Size Badge */}
                            <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
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
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-6 text-base font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isPaymentLoading
                    ? "Waiting for payment..."
                    : "Submitting..."}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  Pay ₦50,000 & Submit Special Order
                </div>
              )}
            </Button>

            {/* Help Text */}
            <p className="border-t pt-4 text-center text-xs text-gray-500">
              Your ₦50,000 commitment deposit is refundable when your actual
              order is placed. We&apos;ll review your request and get back to
              you within 24-48 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
