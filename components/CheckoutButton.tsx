"use client";

import { useCurrency } from "./CurrencyContext";
import PaystackButton from "./PaystackButton";
// import StripeButton from "./StripeButton"; // Uncomment when ready

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

// Countries where Paystack works natively or auto-converts
const PAYSTACK_COUNTRIES = ["NG", "GH", "KE", "ZA"];

export default function CheckoutButton({
  total,
  shippingAddress,
}: CheckoutButtonProps) {
  const { country, isLoading } = useCurrency();

  if (isLoading) {
    return (
      <Button disabled className="cursor-pointer h-10 w-full">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // Paystack-supported countries, always charge in NGN
  if (country && PAYSTACK_COUNTRIES.includes(country)) {
    return <PaystackButton total={total} shippingAddress={shippingAddress} paymentMethod="paystack" />;
  }

  // Everyone else → Stripe (uncomment when ready)
  // return <StripeButton total={total} shippingAddress={shippingAddress} paymentMethod="stripe" />;

  // Temporary fallback until Stripe is set up
  return (
    <div className="space-y-2">
      <Button disabled className="cursor-pointer h-10 w-full">
        Checkout unavailable in {country || "your region"}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        We currently only accept payments from Nigeria, Ghana, Kenya, and South
        Africa.
      </p>
    </div>
  );
}
