"use client";

import { useCurrency } from "./CurrencyContext";
import PaystackButton from "./PaystackButton";
// import StripeButton from "./StripeButton"; // Uncomment when Stripe is ready

import { Button } from "./ui/button";

interface ShippingAddress {
  streetAddress: string;
  apartment: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CheckoutButtonProps {
  total: number;
  shippingAddress?: ShippingAddress;
}

export default function CheckoutButton({
  total,
  shippingAddress,
}: CheckoutButtonProps) {
  const { country, isLoading, currency } = useCurrency();

  if (isLoading) {
    return (
      <Button disabled className="cursor-pointer h-10 w-full">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // Nigeria → Paystack with NGN
  if (country === "NG" && currency.code === "NGN") {
    return <PaystackButton total={total} shippingAddress={shippingAddress} />;
  }

  // Ghana → Paystack with GHS
  if (country === "GH" && currency.code === "GHS") {
    return <PaystackButton total={total} shippingAddress={shippingAddress} />;
  }

  // Nigeria but switched to non-NGN currency
  if (country === "NG" && currency.code !== "NGN") {
    return (
      <Button disabled className="cursor-pointer h-10 w-full">
        Switch to NGN to checkout
      </Button>
    );
  }

  // Ghana but switched to non-GHS currency
  if (country === "GH" && currency.code !== "GHS") {
    return (
      <Button disabled className="cursor-pointer h-10 w-full">
        Switch to GHS to checkout
      </Button>
    );
  }

  // Everyone else → Stripe (uncomment when ready)
  // return <StripeButton total={total} />;

  // Temporary fallback until Stripe is set up
  return (
    <Button disabled className="cursor-pointer h-10 w-full">
      International checkout coming soon
    </Button>
  );
}
