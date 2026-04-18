"use client";

import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useApp } from "./AppContext";
import { useRouter } from "next/navigation";
import { useCurrency } from "./CurrencyContext";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = process.env
  .NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY as string;

interface PaystackReference {
  reference: string;
  status: string;
  message: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export default function PaystackButton({ total }: { total: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const { convertPrice, currency, isLoading: currencyLoading } = useCurrency();
  const { data: session } = useSession();
  const { cart, clearCart } = useApp();
  const router = useRouter();

  const user = session?.user;
  const nairaTotal = convertPrice(total) ?? 0;

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email ?? "",
    amount: Math.round((nairaTotal ?? 0) * 100),
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        },
        {
          display_name: "Phone Number",
          variable_name: "phone",
          value:
            user?.countryCode && user?.phone
              ? `${user.countryCode}${user.phone}`
              : "",
        },
        {
          display_name: "Address",
          variable_name: "address",
          value: user?.address ?? "",
        },
        {
          display_name: "Country",
          variable_name: "country",
          value: user?.country ?? "",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  if (currencyLoading) {
    return (
      <Button type="button" disabled className="cursor-pointer h-10">
        Loading rates...
      </Button>
    );
  }

  const handlePayment = () => {
    setIsLoading(true);

    const onSuccess = async (reference: PaystackReference) => {
      try {
        // FIXED: Properly await and check response
        const response = await fetch("/api/orders/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: reference.reference,
            total: nairaTotal,
            items: cart,
          }),
        });

        // FIXED: Check if response is OK
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save order");
        }

        const data = await response.json();

        // Only clear cart and redirect if save succeeded
        await clearCart();
        toast.success("Order placed successfully!");
        router.push("/account/purchased-items");
      } catch (error) {
        console.error("Failed to save order:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save order. Please contact support.",
        );
        // Don't clear cart - let user retry
      } finally {
        setIsLoading(false);
      }
    };

    const onClose = () => setIsLoading(false);

    initializePayment({ onSuccess, onClose });
  };

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isLoading || !user}
      className="cursor-pointer h-10"
    >
      {isLoading
        ? "Processing..."
        : `Pay ₦${Math.round(nairaTotal).toLocaleString()}`}
    </Button>
  );
}
