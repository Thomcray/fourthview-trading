"use client";

import { SquarePen } from "lucide-react";
import Selection from "./Selection";

interface Country {
  name: {
    common: string;
    official: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

export default function Country({
  countries,
  value,
  onChange,
}: {
  countries: Country[];
  defaultCountry: string;
  value: string; // Controlled - value prop required
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Controlled - onChange required
}) {
  return (
    <div className="w-full">
      <label
        htmlFor="country"
        className="flex flex-row gap-0.5 items-center text-sm font-medium text-gray-700 mb-1"
      >
        Country
        <SquarePen size={12} />
      </label>

      <Selection
        value={value} // Only use value
        onChange={onChange} // Must provide onChange
        width="w-full"
        name="country"
      >
        {countries
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map((country) => (
            <option
              value={country.name.official}
              key={country.name.official}
              className="border"
            >
              {country.name.common}
            </option>
          ))}
      </Selection>
    </div>
  );
}
