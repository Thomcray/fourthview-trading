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
}

export default function PaystackButton({
  total,
  shippingAddress,
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { convertPrice, currency, isLoading: currencyLoading } = useCurrency();
  const { data: session } = useSession();
  const { cart, clearCart } = useApp();
  const router = useRouter();

  const user = session?.user;
  const localTotal = convertPrice(total) ?? 0;

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email ?? "",
    amount: Math.round((localTotal ?? 0) * 100),
    currency: currency.code,
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
          display_name: "Shipping Address",
          variable_name: "address",
          value: shippingAddress?.streetAddress
            ? `${shippingAddress.streetAddress}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""}, ${shippingAddress.city}${shippingAddress.zipCode ? `, ${shippingAddress.zipCode}` : ""}${shippingAddress.country ? `, ${shippingAddress.country}` : ""}`
            : (user?.address ?? ""),
        },
        {
          display_name: "Country",
          variable_name: "country",
          value: (shippingAddress?.country || user?.country) ?? "",
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
        // Verify transaction with Paystack first
        const verifyRes = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: reference.reference }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.verified) {
          throw new Error(verifyData.error || "Payment verification failed");
        }

        // Only save order if verification passed
        const response = await fetch("/api/orders/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: reference.reference,
            total: localTotal,
            items: cart,
            shippingAddress: shippingAddress ?? null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save order");
        }

        // Clear cart and redirect only after everything succeeded
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
        : `Pay ${currency.symbol}${Math.round(localTotal).toLocaleString()}`}
    </Button>
  );
}
