"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Home, Building2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface ShippingAddress {
  streetAddress: string;
  apartment: string;
  city: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddress: ShippingAddress;
  onConfirm: (address: ShippingAddress, saveToProfile: boolean) => void;
  isSaving?: boolean;
}

export default function ShippingAddressModal({
  isOpen,
  onClose,
  initialAddress,
  onConfirm,
  isSaving = false,
}: ShippingAddressModalProps) {
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isComplete = address.streetAddress.trim() && address.city.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Shipping Address
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Street Address */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    name="streetAddress"
                    value={address.streetAddress}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Apartment */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Apartment, Suite, etc. (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    name="apartment"
                    value={address.apartment}
                    onChange={handleChange}
                    placeholder="Apt 4B"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City + Zip */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    ZIP / Postal Code
                  </label>
                  <Input
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    placeholder="100001"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Country
                </label>
                <Input
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  placeholder="Nigeria"
                />
              </div>

              {/* Summary */}
              {isComplete && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">
                    Delivering to:
                  </p>
                  <p className="text-sm text-blue-800">
                    {address.streetAddress}
                    {address.apartment && `, ${address.apartment}`},{" "}
                    {address.city}
                    {address.zipCode && `, ${address.zipCode}`}
                    {address.country && `, ${address.country}`}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2">
              <Button
                onClick={() => onConfirm(address, false)}
                disabled={!isComplete || isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                Use This Address
              </Button>
              <Button
                onClick={() => onConfirm(address, true)}
                disabled={!isComplete || isSaving}
                variant="outline"
                className="w-full gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save & Use"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
