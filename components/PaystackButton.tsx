"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
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

export default function PaystackButton({
  total,
  shippingAddress,
  paymentMethod = "paystack",
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paystackConfig, setPaystackConfig] = useState({
    reference: "",
    email: "",
    amount: 0,
    currency: "NGN",
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: { signature: "", custom_fields: [] as any[] },
  });

  const { currency, isLoading: currencyLoading } = useCurrency();
  const { data: session } = useSession();
  const { cart, clearCart } = useApp();
  const router = useRouter();

  const user = session?.user;

  const initializePayment = usePaystackPayment(paystackConfig);

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

      setPaystackConfig({
        reference,
        email: user.email ?? "",
        amount,
        currency: "NGN",
        publicKey: PAYSTACK_PUBLIC_KEY,
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
      });

      initializePayment({
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

            if (saveData.duplicate) {
              toast.info("Order already processed!");
            } else {
              toast.success("Order placed successfully!");
            }

            await clearCart();
            router.push("/account/purchased-items");
          } catch (error) {
            console.error("Post-payment error:", error);
            toast.error(
              error instanceof Error
                ? error.message
                : "Something went wrong. Please contact support.",
            );
          } finally {
            setIsLoading(false);
          }
        },
        onClose: () => {
          setIsLoading(false);
          toast.info("Payment cancelled");
        },
      });
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

  const displayAmount = total;

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
