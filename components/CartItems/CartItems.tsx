"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useApp } from "../AppContext";
import { ChevronLeft, ShoppingBag, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import CartItemsList from "./CartItemsList";
import OrderSummary from "./OrderSummary";

export default function CartItems() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { cart } = useApp();

  // Select all items by default when cart first loads
  React.useEffect(() => {
    if (cart.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(cart.map((item) => item.id!)));
    }
  }, [cart.length]);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === cart.length) return new Set();
      return new Set(cart.map((item) => item.id!));
    });
  }, [cart]);

  const toggleItemSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedCart = useMemo(
    () => cart.filter((item) => item.id && selectedIds.has(item.id)),
    [cart, selectedIds],
  );

  const subtotal = selectedCart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + (price - (price * discount) / 100) * quantity;
  }, 0);

  const totalShipping = selectedCart.reduce(
    (acc, item) => acc + (Number(item.shippingCost) || 0),
    0,
  );

  const totalDiscount = selectedCart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + ((price * discount) / 100) * quantity;
  }, 0);

  const total = subtotal + totalShipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any items yet
          </p>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="relative flex items-center py-4 mb-6">
        <Link href="/shop">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <h1 className="text-xl font-semibold">My Cart</h1>
          <span className="bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <CartItemsList
          selectedIds={selectedIds}
          toggleItemSelection={toggleItemSelection}
          toggleSelectAll={toggleSelectAll}
        />
        <OrderSummary
          selectedCount={selectedIds.size}
          subtotal={subtotal}
          totalShipping={totalShipping}
          totalDiscount={totalDiscount}
          total={total}
        />
      </div>
    </div>
  );
}
