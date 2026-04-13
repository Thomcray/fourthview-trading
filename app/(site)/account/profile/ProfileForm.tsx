"use client";

import { updateUserProfile } from "@/app/_lib/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserImage from "@/components/UserImage";
import Phone from "@/components/Phone";
import Country from "@/components/Country";
import {
  SquarePen,
  User,
  Mail,
  MapPin,
  Home,
  Building2,
  Smartphone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTransition, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CountryWithCode {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  dialCode?: string;
}

export default function ProfileForm({
  userId,
  firstName,
  lastName,
  email,
  streetAddress,
  apartment,
  city,
  zipCode,
  address,
  initialCountryCode,
  initialPhone,
  initialCountry,
  countries,
  uniqueDialCodes,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress?: string;
  apartment?: string;
  city?: string;
  zipCode?: string;
  address: string;
  initialCountryCode: string;
  initialPhone: string;
  initialCountry: string;
  countries?: CountryWithCode[];
  uniqueDialCodes?: string[];
}) {
  const { data: session } = useSession();
  const nameInitial =
    session?.user?.firstName?.charAt(0) || firstName?.charAt(0) || "U";
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  // Create a map of dial codes to countries for easy lookup
  const dialCodeToCountryMap = new Map();
  countries?.forEach((country) => {
    const root = country.idd?.root || "";
    const suffix = country.idd?.suffixes?.[0] || "";
    const dialCode = root + suffix;
    if (dialCode && dialCode !== "undefined") {
      dialCodeToCountryMap.set(dialCode, country.name.official);
    }
  });

  // State for controlled components
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [dialCode, setDialCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    // Find and update the dial code based on selected country
    const country = countries?.find((c) => c.name.official === newCountry);
    if (country) {
      const root = country.idd?.root || "";
      const suffix = country.idd?.suffixes?.[0] || "";
      const newDialCode = root + suffix;
      if (newDialCode && newDialCode !== "undefined") {
        setDialCode(newDialCode);
      }
    }
  };

  const handleDialCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDialCode = e.target.value;
    setDialCode(newDialCode);

    // Find and update the country based on selected dial code
    const countryName = dialCodeToCountryMap.get(newDialCode);
    if (countryName) {
      setSelectedCountry(countryName);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    // Get values from form
    const countryCode = dialCode;
    const phone = phoneNumber;
    const country = selectedCountry;
    const addressValue = address;
    const streetAddressValue = formData.get("streetAddress") as string;
    const apartmentValue = formData.get("apartment") as string;
    const cityValue = formData.get("city") as string;
    const zipCodeValue = formData.get("zipCode") as string;

    startTransition(async () => {
      try {
        if (userId) {
          await updateUserProfile(
            countryCode,
            phone,
            country,
            addressValue,
            userId,
            streetAddressValue,
            apartmentValue,
            cityValue,
            zipCodeValue,
          );
          toast.success("Profile updated successfully");
          setIsEditing(false);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <div className="px-6 py-8 sm:p-10">
      {/* User Image Section */}
      <div className="flex flex-col items-center mb-8">
        <UserImage nameInitial={nameInitial} session={session} />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          {firstName} {lastName}
        </h2>
        <p className="text-gray-600">{email}</p>
      </div>

      {/* Profile Form */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </h3>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            >
              <SquarePen className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="firstName"
                  defaultValue={firstName}
                  className="pl-10 py-6 border-gray-200 bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="lastName"
                  defaultValue={lastName}
                  className="pl-10 py-6 border-gray-200 bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  defaultValue={email}
                  className="pl-10 py-6 border-gray-200 bg-gray-50"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="streetAddress"
                    defaultValue={streetAddress || ""}
                    className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                    required={isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, Suite, etc. (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="apartment"
                    defaultValue={apartment || ""}
                    className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    defaultValue={city || ""}
                    className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                    required={isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    defaultValue={zipCode || ""}
                    className="py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                    required={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {countries && uniqueDialCodes && (
                <>
                  <Country
                    countries={countries}
                    defaultCountry={initialCountry}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                  />

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="w-24">
                        <select
                          name="countryCode"
                          value={dialCode}
                          onChange={handleDialCodeChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isEditing}
                        >
                          {uniqueDialCodes.map((code) => (
                            <option value={code} key={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Input
                        type="tel"
                        name="phone"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="flex-1 px-3 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Phone number"
                        disabled={!isEditing}
                        required={isEditing}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hidden field for compatibility */}
          <input type="hidden" name="address" value={address} />

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedCountry(initialCountry);
                  setDialCode(initialCountryCode);
                  setPhoneNumber(initialPhone);
                }}
                className="flex-1 py-6 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
