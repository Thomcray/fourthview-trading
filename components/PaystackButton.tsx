"use client";

import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
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

  const handlePayment = () => {
    setIsLoading(true);

    const onSuccess = (reference: PaystackReference) => {
      console.log(reference);
      setIsLoading(false);
    };

    const onClose = () => {
      console.log("Closed");
      setIsLoading(false);
    };

    initializePayment({ onSuccess, onClose });
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
