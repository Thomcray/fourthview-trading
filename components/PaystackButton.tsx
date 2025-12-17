"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

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

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { usePaystackPayment } = await import("react-paystack");

      const config = {
        reference: new Date().getTime().toString(),
        email: "ternathompson2@gmail.com",
        amount: Math.round(total * 100),
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: "Terna Nanev",
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: "+2348128909551",
            },
          ],
        },
      };

      const initializePayment = usePaystackPayment(config);

      const onSuccess = (reference: PaystackReference) => {
        // Implementation for whatever you want to do with reference and after success call
        console.log(reference);
        setIsLoading(false);
      };

      const onClose = () => {
        // Implementation for whatever you want to do when the Paystack dialog closed
        console.log("Closed");
        setIsLoading(false);
      };

      // Initialize payment
      initializePayment({ onSuccess, onClose });
    } catch (error) {
      console.error("Payment initialization error:", error);
      setIsLoading(false);
    }
  };
  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isLoading}
      className="cursor-pointer h-10"
    >
      {isLoading ? "Loading" : "Checkout"}
    </Button>
  );
}
