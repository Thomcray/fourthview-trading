"use client";

import { useCallback } from "react";
import { Button } from "../ui/button";
import { useApp } from "../AppContext";
import {
  Trash2,
  MinusIcon,
  PlusIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ProductPrice from "../ProductPrice";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

type Props = {
  selectedIds: Set<number>;
  toggleItemSelection: (id: number) => void;
  toggleSelectAll: () => void;
};

export default function CartItemsList({
  selectedIds,
  toggleItemSelection,
  toggleSelectAll,
}: Props) {
  const { cart, removeFromCart, updateQuantity, updateVariant, updatingItems } =
    useApp();

  const handleRemove = useCallback(
    async (id: number) => {
      try {
        await removeFromCart(id);
      } catch {
        toast.error("Failed to remove item");
      }
    },
    [removeFromCart],
  );

  const handleQuantityUpdate = useCallback(
    async (id: number, newQuantity: number) => {
      if (newQuantity < 1) return;
      try {
        await updateQuantity(id, newQuantity);
      } catch {
        toast.error("Failed to update quantity");
      }
    },
    [updateQuantity],
  );

  const handleColourUpdate = useCallback(
    async (id: number, newColour: string) => {
      const item = cart.find((i) => i.id === id);
      if (!item || item.colour === newColour || !item.productId) return;

      const variantExists = cart.some(
        (i) =>
          i.productId === item.productId &&
          i.colour === newColour &&
          i.size === item.size &&
          i.id !== id,
      );

      if (variantExists) {
        toast.info("This colour variant is already in your cart");
        return;
      }

      try {
        await updateVariant(id, { colour: newColour }, item.productId);
        toast.success("Colour updated");
      } catch {
        toast.error("Failed to update colour");
      }
    },
    [cart, updateVariant],
  );

  const handleSizeUpdate = useCallback(
    async (id: number, newSize: string) => {
      const item = cart.find((i) => i.id === id);
      if (!item || item.size === newSize || !item.productId) return;

      const variantExists = cart.some(
        (i) =>
          i.productId === item.productId &&
          i.colour === item.colour &&
          i.size === newSize &&
          i.id !== id,
      );

      if (variantExists) {
        toast.info("This size variant is already in your cart");
        return;
      }

      try {
        await updateVariant(id, { size: newSize }, item.productId);
        toast.success("Size updated");
      } catch {
        toast.error("Failed to update size");
      }
    },
    [cart, updateVariant],
  );

  return (
    <div className="flex-1 space-y-4">
      {/* Select All */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              selectedIds.size === cart.length && cart.length > 0
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {selectedIds.size === cart.length && cart.length > 0 && (
              <CheckCircle className="w-4 h-4 text-white" />
            )}
          </button>
          <span className="text-sm font-medium text-gray-700">
            Select All ({cart.length} items)
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {cart.map((item, index) => {
            const id = item.id!;
            const isSelected = selectedIds.has(id);
            const itemQuantity = item.quantity || 0;
            const itemPrice = item.price || 0;
            const itemDiscount = item.discount || 0;
            const isUpdating = updatingItems.has(id);

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                  layout: { duration: 0.2 },
                }}
                className={`bg-white rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-300 shadow-md ring-1 ring-blue-200"
                    : "border-gray-100 hover:shadow-md"
                } ${isUpdating ? "opacity-75" : ""}`}
              >
                <div className="flex gap-4 p-4">
                  {/* Checkbox */}
                  <div className="shrink-0 pt-1">
                    <button
                      onClick={() => toggleItemSelection(id)}
                      disabled={isUpdating}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      } ${isUpdating ? "cursor-not-allowed" : ""}`}
                    >
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Image */}
                  {item.image && (
                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.itemName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                        priority={index < 3}
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.itemName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.size && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Size: {item.size}
                            </span>
                          )}
                          {item.colour && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Colour:
                              <span
                                className="w-4 h-4 rounded-full inline-block border border-gray-200"
                                style={{ backgroundColor: item.colour }}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(id)}
                        disabled={isUpdating}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Colour Selector */}
                    {item.productColours && item.productColours.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1.5">
                          Change Colour:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.productColours.map((colourHex, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleColourUpdate(id, colourHex)}
                              disabled={isUpdating}
                              className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                                item.colour === colourHex
                                  ? "border-blue-500 ring-2 ring-blue-200 ring-offset-1 scale-110"
                                  : "border-gray-300 hover:border-gray-400 hover:scale-105"
                              }`}
                              style={{ backgroundColor: colourHex }}
                              title={colourHex}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selector */}
                    {item.productSizes && item.productSizes.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1.5">
                          Change Size:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.productSizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSizeUpdate(id, size)}
                              disabled={isUpdating}
                              className={`px-2.5 py-1 text-xs rounded-md transition-all disabled:opacity-50 ${
                                item.size === size
                                  ? "bg-blue-600 text-white ring-2 ring-blue-300"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price & Quantity */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                      <div className="shrink-0">
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

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() =>
                            handleQuantityUpdate(
                              id,
                              Math.max(1, itemQuantity - 1),
                            )
                          }
                          disabled={isUpdating || itemQuantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          <MinusIcon className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-10 text-center font-medium shrink-0">
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            itemQuantity
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityUpdate(id, itemQuantity + 1)
                          }
                          disabled={isUpdating}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 shrink-0"
                        >
                          <PlusIcon className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Removing indicator */}
                <AnimatePresence>
                  {isUpdating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 px-4 py-2 flex items-center gap-2 text-sm text-red-600 border-t border-red-100"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Updating item...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
