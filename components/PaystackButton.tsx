"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useApp } from "./AppContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "./CurrencyContext";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!;

interface PaystackReference {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface ShippingAddress {
  streetAddress: string;
  apartment: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PaystackButtonProps {
  total: number;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

// Paystack lives on window after the script loads
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: object) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve(); // already loaded
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
}

export default function PaystackButton({
  total,
  shippingAddress,
  paymentMethod = "paystack",
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { currency, isLoading: currencyLoading, convertPrice } = useCurrency();
  const { data: session } = useSession();
  const { cart, clearCart } = useApp();
  const router = useRouter();

  const user = session?.user;

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      // Load Paystack script if not already loaded
      await loadPaystackScript();

      // Get server-calculated amount
      const intentRes = await fetch("/api/payment/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingAddress: shippingAddress ?? null,
          paymentMethod,
        }),
      });

      const intentData = await intentRes.json();

      if (!intentRes.ok) {
        throw new Error(intentData.error || "Failed to initialize payment");
      }

      const { reference, amount, signature } = intentData;

      console.log(amount);

      // Initialize Paystack directly — no hook, no state race
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email ?? "",
        amount,
        currency: "NGN",
        ref: reference,
        metadata: {
          signature,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value:
                user.countryCode && user.phone
                  ? `${user.countryCode}${user.phone}`
                  : "",
            },
            {
              display_name: "Country",
              variable_name: "country",
              value: shippingAddress?.country ?? user.country ?? "",
            },
          ],
        },
        onSuccess: async (paystackRef: PaystackReference) => {
          try {
            const saveRes = await fetch("/api/orders/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: paystackRef.reference,
                signature,
                items: cart,
                shippingAddress: shippingAddress ?? null,
                paymentMethod,
              }),
            });

            const saveData = await saveRes.json();

            if (!saveRes.ok) {
              console.error("Order save failed after payment:", saveData);
              throw new Error(
                saveData.error ||
                  "Payment succeeded but order failed. Please contact support.",
              );
            }

            await clearCart();
            setIsLoading(false);

            if (saveData.duplicate) {
              toast.info("Order already processed!", {
                onClose: () => router.push("/account/purchased-items"),
                autoClose: 2000,
              });
            } else {
              toast.success("Order placed successfully!", {
                onClose: () => router.push("/account/purchased-items"),
                autoClose: 2000,
              });
            }
          } catch (error) {
            console.error("Post-payment error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Something went wrong. Please contact support.",
            );
            setIsLoading(false);
          }
        },
        onClose: () => {
          setIsLoading(false);
          toast.info("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start payment. Please try again.",
      );
      setIsLoading(false);
    }
  };

  if (currencyLoading) {
    return (
      <Button disabled className="cursor-pointer h-10 w-full">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  const displayAmount = convertPrice(total) ?? 0;

  return (
    <div className="w-full">
      <Button
        type="button"
        onClick={handlePayment}
        disabled={isLoading || !user}
        className="cursor-pointer h-10 w-full"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          `Pay ${currency.symbol}${displayAmount.toLocaleString()}`
        )}
      </Button>
      <p className="text-xs text-gray-400 mt-1 text-center">
        Billed in Nigerian Naira (NGN)
      </p>
    </div>
  );
}
