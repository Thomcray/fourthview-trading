"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
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

interface PaystackButtonProps {
  total: number;
  items: CheckoutItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      return resolve();
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

export default function PaystackButton({
  total,
  items,
  shippingAddress,
  paymentMethod = "paystack",
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { currency, isLoading: currencyLoading, convertPrice } = useCurrency();

  const { data: session } = useSession();

  const router = useRouter();

  const user = session?.user;

  useEffect(() => {
    loadPaystackScript().catch(() => {});
  }, []);

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    if (!items || items.length === 0) {
      toast.error("No items selected for checkout");
      return;
    }

    setIsLoading(true);

    try {
      await loadPaystackScript();

      console.log("Checkout items being sent to payment intent:", items);

      const intentRes = await fetch("/api/payment/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddress: shippingAddress ?? null,
          paymentMethod,
        }),
      });

      const intentData = await intentRes.json();

      if (!intentRes.ok) {
        throw new Error(intentData.error || "Failed to initialize payment");
      }

      const { reference, amount, signature } = intentData;

      const handlePaymentSuccess = async () => {
        try {
          const maxAttempts = 15;

          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const response = await fetch("/api/payment/status", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                reference,
              }),
            });

            const data = await response.json();

            if (data.status === "completed") {
              setIsLoading(false);

              toast.success("Order placed successfully!", {
                onClose: async () => {
                  router.push("/account/purchased-items");
                },
                autoClose: 1500,
              });

              return;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          setIsLoading(false);

          toast.info(
            "Payment successful. Your order is still being processed. Please check your orders shortly.",
          );
        } catch (error) {
          console.error("Payment status check failed:", error);

          setIsLoading(false);

          toast.error(
            "Payment was successful, but we couldn't confirm your order yet.",
          );
        }
      };

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

        callback: () => {
          handlePaymentSuccess();
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
      <Button disabled className="h-10 w-full cursor-pointer">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
        disabled={isLoading || !user || items.length === 0}
        className="h-10 w-full cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          `Pay ${currency.symbol}${Math.round(displayAmount).toLocaleString()}`
        )}
      </Button>

      <p className="mt-1 text-center text-xs text-gray-400">
        Billed in Nigerian Naira (NGN)
      </p>
    </div>
  );
}
