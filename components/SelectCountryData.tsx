// components/SelectCountryData.tsx
"use client";

import { useEffect, useState } from "react";
import Country from "./Country";
import Phone from "./Phone";

interface CountryType {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag?: string;
}

interface CountryWithCode extends CountryType {
  dialCode: string;
}

export default function SelectCountryData() {
  const [countries, setCountries] = useState<CountryWithCode[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueDialCodes, setUniqueDialCodes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        const response = await fetch("/api/countries");

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();

        if (!data.countries || !Array.isArray(data.countries)) {
          throw new Error("Invalid countries data");
        }

        // Map countries to include dial code
        const countriesWithCodes: CountryWithCode[] = data.countries
          .map((country: CountryType) => {
            const root = country.idd?.root || "";
            const suffix = country.idd?.suffixes?.[0] || "";
            const dialCode = root + suffix;

            return {
              ...country,
              dialCode: dialCode && dialCode !== "undefined" ? dialCode : "",
            };
          })
          .filter((country: CountryWithCode) => country.dialCode);

        setCountries(countriesWithCodes);

        // Create unique dial codes
        const unique = Array.from(
          new Set(countriesWithCodes.map((c) => c.dialCode)),
        ).filter((code) => code !== "undefined");
        setUniqueDialCodes(unique);

        // Set default country (Nigeria)
        const defaultCountry = countriesWithCodes.find(
          (country: CountryWithCode) =>
            country.name.official === "Federal Republic of Nigeria",
        );

        if (defaultCountry) {
          setSelectedCountry(defaultCountry.name.official);
          setDialCode(defaultCountry.dialCode);
        } else if (countriesWithCodes.length > 0) {
          setSelectedCountry(countriesWithCodes[0].name.official);
          setDialCode(countriesWithCodes[0].dialCode);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name.official === countryName);

    setSelectedCountry(countryName);
    if (country) {
      setDialCode(country.dialCode); // Update dial code when country changes
    }
  };

  const handleDialCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDialCode = e.target.value;
    setDialCode(newDialCode);

    // Find the first country with this dial code
    const country = countries.find((c) => c.dialCode === newDialCode);
    if (country) {
      setSelectedCountry(country.name.official); // Update country when dial code changes
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full h-20 bg-gray-100 animate-pulse rounded"></div>
        <div className="w-full h-20 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Country
        countries={countries}
        defaultCountry="Federal Republic of Nigeria"
        value={selectedCountry} // Pass value
        onChange={handleCountryChange} // Pass onChange
      />

      <Phone
        uniqueDialCodes={uniqueDialCodes}
        countries={countries}
        phone=""
        value={dialCode} // Pass value
        onChange={handleDialCodeChange} // Pass onChange
      />

      {/* Hidden input to ensure dial code is submitted */}
      <input type="hidden" name="countryCode" value={dialCode} />
    </div>
  );
}
