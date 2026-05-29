// app/signup/SignupForm.tsx (improved but compatible)
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, MapPin, Mail, User, Lock } from "lucide-react";
import { toast } from "react-toastify";
import PasswordValidity from "@/components/PasswordValidity";
import SelectCountryData from "@/components/SelectCountryData";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      const res = await fetch("/api/send", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) toast.error(data?.message);
      else toast.success(data?.message);
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Two column layout for basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              id="firstName"
              name="firstName"
              className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              id="lastName"
              name="lastName"
              className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            id="email"
            name="email"
            className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Address Section - NEW but using 'address' field name for compatibility */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Address Information</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <Input
            type="text"
            id="streetAddress"
            name="streetAddress"
            className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc. (Optional)
          </label>
          <Input
            type="text"
            id="apartment"
            name="apartment"
            className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <Input
              type="text"
              id="city"
              name="city"
              className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New York"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP / Postal Code *
            </label>
            <Input
              type="text"
              id="zipCode"
              name="zipCode"
              className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10001"
              required
            />
          </div>
        </div>

        {/* Combined address field (hidden but included for backward compatibility) */}
        <input type="hidden" id="address" name="address" />
      </div>

      {/* Country and Phone - Your existing component */}
      <SelectCountryData />

      {/* Password Section */}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-12 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {showPassword ? (
              <Eye
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 cursor-pointer hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeClosed
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 cursor-pointer hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
        </div>
      </div>

      <PasswordValidity password={password} />

      <Button
        type="submit"
        className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
        disabled={isPending}
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
