"use client";

import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Button } from "./ui/button";
import { convertToNaira } from "@/utils/toNaira";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useSession } from "next-auth/react";
import { useApp } from "./AppContext";
import { useRouter } from "next/navigation";

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
  const { rate, isLoading: rateLoading } = useExchangeRate();
  const { data: session } = useSession();

  const user = session?.user;
  const nairaTotal = rate ? convertToNaira(total, rate) : 0;

  const { cart, clearCart } = useApp();
  const router = useRouter();

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email ?? "",
    amount: Math.round(nairaTotal * 100),
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

  const handlePayment = () => {
    setIsLoading(true);

    const onSuccess = async (reference: PaystackReference) => {
      try {
        await fetch("/api/orders/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference: reference.reference,
            total: nairaTotal,
            items: cart,
          }),
        });

        await clearCart();
        router.push("/account/purchased-items");
      } catch (error) {
        console.error("Failed to save order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const onClose = () => {
      setIsLoading(false);
    };

    initializePayment({ onSuccess, onClose });
  };

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isLoading || rateLoading || !user}
      className="cursor-pointer h-10"
    >
      {isLoading ? "Processing..." : "Checkout"}
    </Button>
  );
}
