// components/CartItems.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useApp } from "../AppContext";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  MinusIcon,
  PlusIcon,
  ShoppingCart,
  Truck,
  Tag,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ProductPrice from "../ProductPrice";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const PaystackButton = dynamic(() => import("../PaystackButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="cursor-pointer h-12 w-full">
      Loading...
    </Button>
  ),
});

type CartItem = {
  itemName: string;
  price: number;
  quantity: number;
  discount?: number;
  shippingCost?: number;
  image?: string;
  size?: string;
  productSizes?: string[];
  cartId?: string;
};

export default function CartItems() {
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { cart, removeFromCart, updateQuantity, updateSize } = useApp();
  const router = useRouter();

  // Initialize selected items when cart changes
  React.useEffect(() => {
    // Select all items by default when cart loads
    if (cart.length > 0 && selectedItems.size === 0) {
      setSelectedItems(new Set(cart.map((item) => item.itemName)));
    }
  }, [cart]);

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map((item) => item.itemName)));
    }
  };

  // Toggle single item
  const toggleItemSelection = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  // Calculate totals for selected items only
  const selectedCart = useMemo(() => {
    return cart.filter((item) => selectedItems.has(item.itemName));
  }, [cart, selectedItems]);

  const subtotal = selectedCart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + (price - (price * discount) / 100) * quantity;
  }, 0);

  const totalShipping = selectedCart.reduce((acc, item) => {
    return acc + (Number(item.shippingCost) || 0);
  }, 0);

  const totalDiscount = selectedCart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + ((price * discount) / 100) * quantity;
  }, 0);

  const total = subtotal + totalShipping;
  const selectedCount = selectedItems.size;

  const handleRemove = async (itemName: string) => {
    setRemovingItem(itemName);
    try {
      await removeFromCart(itemName);
      // Remove from selected items as well
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemName);
        return newSet;
      });
    } catch (error) {
      console.error("Error removing from cart: ", error);
    } finally {
      setRemovingItem(null);
    }
  };

  const handleQuantityUpdate = async (
    itemName: string,
    newQuantity: number,
  ) => {
    setUpdatingItem(itemName);
    try {
      await updateQuantity(itemName, newQuantity);
    } catch (error) {
      console.error("Error updating quantity: ", error);
    } finally {
      setUpdatingItem(null);
    }
  };

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
          <Button
            onClick={() => router.push("/shop")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Start Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="relative flex items-center py-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <h1 className="text-xl font-semibold">My Cart</h1>
          <span className="bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {/* Select All */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  selectedItems.size === cart.length && cart.length > 0
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {selectedItems.size === cart.length && cart.length > 0 && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </button>
              <span className="text-sm font-medium text-gray-700">
                Select All ({cart.length} items)
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>

          <AnimatePresence>
            {cart.map((item, index) => {
              const isSelected = selectedItems.has(item.itemName);
              const itemQuantity = item.quantity || 0;
              const itemPrice = item.price || 0;
              const itemDiscount = item.discount || 0;

              return (
                <motion.div
                  key={item.itemName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl border transition-all ${
                    isSelected
                      ? "border-blue-300 shadow-md ring-1 ring-blue-200"
                      : "border-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Selection Checkbox */}
                    <div className="shrink-0 pt-1">
                      <button
                        onClick={() => toggleItemSelection(item.itemName)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>

                    {/* Product Image */}
                    {item.image && (
                      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                        <Image
                          src={item.image}
                          alt={item.itemName}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="80px"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 truncate">
                            {item.itemName}
                          </h3>
                          {item.size && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.itemName)}
                          disabled={removingItem === item.itemName}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size Selector */}
                      {item.productSizes && item.productSizes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.productSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => updateSize(item.itemName, size)}
                              className={`
                                px-2.5 py-1 text-xs rounded-md transition-all
                                ${
                                  item.size === size
                                    ? "bg-blue-600 text-white ring-2 ring-blue-300"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }
                              `}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          {itemDiscount > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400 line-through">
                                <ProductPrice yuanPrice={itemPrice} />
                              </span>
                              <span className="text-lg font-bold text-red-600">
                                <ProductPrice
                                  yuanPrice={itemPrice}
                                  discount={itemDiscount}
                                />
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">
                              <ProductPrice yuanPrice={itemPrice} />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.itemName,
                                Math.max(1, itemQuantity - 1),
                              )
                            }
                            disabled={updatingItem === item.itemName}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
                          >
                            <MinusIcon className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {updatingItem === item.itemName ? (
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              itemQuantity
                            )}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.itemName,
                                itemQuantity + 1,
                              )
                            }
                            disabled={updatingItem === item.itemName}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
                          >
                            <PlusIcon className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove confirmation bar */}
                  {removingItem === item.itemName && (
                    <div className="bg-red-50 px-4 py-2 flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      Removing item...
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
              <h2 className="text-white font-semibold text-lg">
                Order Summary
              </h2>
              <p className="text-blue-100 text-sm">
                {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
              </p>
            </div>

            <div className="p-5 space-y-4">
              {selectedCount === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No items selected</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select items to checkout
                  </p>
                </div>
              ) : (
                <>
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <ProductPrice yuanPrice={subtotal} />
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    {totalShipping > 0 ? (
                      <ProductPrice yuanPrice={totalShipping} />
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </div>

                  {/* Discount */}
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-gray-600">Discount</span>
                      </div>
                      <span className="text-green-600">
                        - <ProductPrice yuanPrice={totalDiscount} />
                      </span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        <ProductPrice yuanPrice={total} />
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      *Shipping cost included where applicable
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-2">
                    <PaystackButton total={total} />
                  </div>
                </>
              )}

              {/* Secure Checkout Note */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Secure Checkout
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-1" />
                100% Safe
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
