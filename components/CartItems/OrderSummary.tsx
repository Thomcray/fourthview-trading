"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import ProductPrice from "../ProductPrice";
import { useCurrency } from "../CurrencyContext";
import { ShoppingCart, Truck, Tag, Mail } from "lucide-react";

const CheckoutButton = dynamic(() => import("../CheckoutButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="cursor-pointer h-12 w-full">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Loading...
    </Button>
  ),
});

type Props = {
  selectedCount: number;
  subtotal: number;
  totalShipping: number;
  totalDiscount: number;
  total: number;
};

export default function OrderSummary({
  selectedCount,
  subtotal,
  totalShipping,
  totalDiscount,
  total,
}: Props) {
  const { country } = useCurrency();
  const isNigeria = country === "NG";

  return (
    <div className="w-full lg:w-96 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
          <h2 className="text-white font-semibold text-lg">Order Summary</h2>
          <p className="text-blue-100 text-sm">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>

        <div className="p-5 space-y-4">
          {selectedCount === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No items selected</p>
              <p className="text-xs text-gray-400 mt-1">
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
                  <Truck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Shipping</span>
                </div>
                {isNigeria ? (
                  totalShipping > 0 ? (
                    <ProductPrice yuanPrice={totalShipping} />
                  ) : (
                    <span className="text-green-600">Free</span>
                  )
                ) : (
                  <span className="text-amber-600 text-xs font-medium">
                    Calculated after checkout
                  </span>
                )}
              </div>

              {/* International shipping notice */}
              {!isNigeria && (
                <div className="flex gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    International shipping cost will be calculated and sent to
                    your email after checkout.
                  </p>
                </div>
              )}

              {/* Discount */}
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-gray-600">Discount</span>
                  </div>
                  <span className="flex text-green-600 whitespace-nowrap">
                    - <ProductPrice yuanPrice={totalDiscount} />
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {/* For Nigeria include shipping, for others exclude it */}
                    <ProductPrice yuanPrice={isNigeria ? total : subtotal} />
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isNigeria
                    ? "*Shipping cost included where applicable"
                    : "*Excludes international shipping"}
                </p>
              </div>

              <div className="pt-2">
                <CheckoutButton total={isNigeria ? total : subtotal} />
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Secure Checkout
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-1" />
            100% Safe
          </div>
        </div>
      </div>
    </div>
  );
}
