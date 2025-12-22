"use client";

import { specialOrders } from "@/app/_lib/actions/special-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

export default function SpecialOrders() {
  const [orderImages, setOrderImages] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const { data: session } = useSession();

  const userId = session?.user.id;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const imageExists = orderImages.some(
      (image) => image.name === files[0]?.name
    );

    if (orderImages.length >= 2) {
      toast.warning("Maximun of two(2) images only");
      e.target.value = "";
      return;
    }

    if (imageExists) {
      toast.error("Image already added");
      e.target.value = "";
      return;
    }
    setOrderImages((prev) => [...prev, ...files]);
    e.target.value = ""; // Always set to empty string
    // e.target.value = isUpdatePage ? "" : e.target.value;
  };

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);

    startTransition(async () => {
      try {
        await specialOrders(formData, userId, orderImages);
        toast.success("Your order has been sent!");

        // reset form after order is sent
        form.reset();
        // reset error state if error
        if (error) setError("");
      } catch (error) {
        setError("File must be an image and less than 2MB");
        toast.error((error as Error).message);
      }
    });
  };
  return (
    <section className="w-full h-full flex items-center justify-center border-0 max-sm:px-4 bg-white">
      <div className="max-w-xl max-sm:w-full mt-4 border rounded-md px-4 mb-4 pt-4">
        <form className="flex flex-col gap-4 border-0" onSubmit={handleOrder}>
          <h1 className="text-4xl text-blue-900 font-semibold text-center">
            For special offers, requests, enquiries, leave a note and your
            email. We&apos;ll get back to you.
          </h1>

          <div className="w-full flex flex-col gap-4 max-sm:px-4">
            <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
              Email
              <Input
                type="email"
                name="email"
                value={session?.user.email || ""}
                className="py-6 px-4"
                readOnly
              />
            </Label>

            <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
              Order Description
              <Textarea
                name="description"
                placeholder="Order description"
                className="py-6 px-4"
                required
              />
            </Label>
          </div>

          <Label className="text-sm text-slate-500 flex flex-col gap-1 text-left items-baseline font-light">
            Image (Add multiple...)
            <p className="text-orange-500 text-base font-light">
              <span className="font-bold">Note:</span> Image must be less than
              2MB
            </p>
            <div className="py-8 px-4 flex items-center border border-dashed rounded-md">
              <Input
                type="file"
                multiple
                name="orderImages"
                placeholder="Upload"
                className=""
                accept="image/*"
                onChange={handleImageChange}
                // required={isUpdatePage || images.length > 0 ? false : true}
              />
            </div>
          </Label>

          {orderImages.length > 0 && (
            <div>
              <p className="text-sm text-slate-500 mb-2">
                {orderImages.length > 1 ? "New Images" : "New Image"}
              </p>
              <div className="grid grid-cols-4 gap-2 w-full">
                {orderImages.map((image, index) => (
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
                      //   onClick={() => removeImage(image)}
                    >
                      <X size={14} className="text-black hover:text-black" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-blue-900 text-white py-6 text-base mb-4"
          >
            {isPending ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </div>
    </section>
  );
}
