"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import ProductPrice from "../ProductPrice";
import { useCurrency } from "../CurrencyContext";
import { ShoppingCart, Truck, Tag, Mail } from "lucide-react";
import { useSession } from "next-auth/react";

const CheckoutButton = dynamic(() => import("../CheckoutButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="cursor-pointer h-12 w-full">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Loading...
    </Button>
  ),
});

interface ShippingAddress {
  streetAddress: string;
  apartment: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CheckoutItem {
  id?: number;
  productId?: number;
  cartId?: number;
  itemName?: string;
  name?: string;
  price?: number;
  unitPrice?: number;
  quantity?: number;
  size?: string | null;
  colour?: string;
  image?: string | null;
  shipping?: number;
  shippingCost?: number;
  discount?: number;
  itemTotal?: number;
}

interface OrderSummaryProps {
  selectedCount: number;
  selectedItems: CheckoutItem[];
  subtotal: number;
  totalShipping: number;
  totalDiscount: number;
  total: number;
}

export default function OrderSummary({
  selectedCount,
  selectedItems,
  subtotal,
  totalShipping,
  totalDiscount,
  total,
}: OrderSummaryProps) {
  const { country } = useCurrency();
  const { data: session } = useSession();

  const isNigeria = country === "NG";
  //const isGhana = country === "GH";

  const shippingAddress: ShippingAddress = {
    streetAddress: session?.user?.streetAddress ?? "",
    apartment: session?.user?.apartment ?? "",
    city: session?.user?.city ?? "",
    zipCode: session?.user?.zipCode ?? "",
    country: session?.user?.country ?? "",
  };

  return (
    <div className="w-full shrink-0 lg:w-96">
      <div className="sticky top-24 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Order Summary</h2>

          <p className="text-sm text-blue-100">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>

        <div className="space-y-4 p-5">
          {selectedCount === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-6 w-6 text-gray-400" />
              </div>

              <p className="text-sm text-gray-500">No items selected</p>

              <p className="mt-1 text-xs text-gray-400">
                Select items to checkout
              </p>
            </div>
          ) : (
            <>
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <ProductPrice yuanPrice={subtotal} />
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">Shipping</span>
                </div>

                {isNigeria ? (
                  totalShipping > 0 ? (
                    <ProductPrice yuanPrice={totalShipping} />
                  ) : (
                    <span className="text-green-600">Free</span>
                  )
                ) : (
                  <span className="text-xs font-medium text-amber-600">
                    Calculated after checkout
                  </span>
                )}
              </div>

              {/* International shipping notice */}
              {!isNigeria && (
                <div className="flex gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                  <p className="text-xs text-amber-700">
                    Shipping to countries outside Nigeria will be calculated and
                    sent to your email after checkout.
                  </p>
                </div>
              )}

              {/* Discount */}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-green-500" />

                    <span className="text-gray-600">Discount</span>
                  </div>

                  <span className="flex whitespace-nowrap text-green-600">
                    - <ProductPrice yuanPrice={totalDiscount} />
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Total</span>

                  <span className="text-xl font-bold text-blue-600">
                    <ProductPrice yuanPrice={isNigeria ? total : subtotal} />
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {isNigeria
                    ? "*Shipping cost included where applicable"
                    : "*Excludes international shipping"}
                </p>
              </div>

              <div className="pt-2">
                <CheckoutButton
                  total={isNigeria ? total : subtotal}
                  items={selectedItems}
                  shippingAddress={shippingAddress}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-gray-400">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Secure Checkout
            <div className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
            100% Safe
          </div>
        </div>
      </div>
    </div>
  );
}
