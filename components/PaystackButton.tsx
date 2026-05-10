"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useApp } from "./AppContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "./CurrencyContext";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!;

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

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: object) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
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

  // Preload Paystack script on mount
  useEffect(() => {
    loadPaystackScript().catch(() => {});
  }, []);

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
      await loadPaystackScript();

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
        // Paystack v1 uses "callback" not "onSuccess"
        // Order saving is handled by the webhook — client just redirects
        callback: () => {
          clearCart().then(() => {
            setIsLoading(false);
            toast.success("Order placed successfully!", {
              onClose: () => router.push("/account/purchased-items"),
              autoClose: 2000,
            });
          });
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
          `Pay ${currency.symbol}${Math.round(displayAmount).toLocaleString()}`
        )}
      </Button>
      <p className="text-xs text-gray-400 mt-1 text-center">
        Billed in Nigerian Naira (NGN)
      </p>
    </div>
  );
}
