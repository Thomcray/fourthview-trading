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
  defaultCountry,
}: {
  countries: Country[];
  defaultCountry: string;
}) {
  return (
    <div>
      <label
        htmlFor="country"
        className="flex flex-row gap-0.5 items-center text-sm font-medium text-gray-700"
      >
        Country
        <SquarePen size={12} />
      </label>

      <div className="flex flex-row space-x-1 items-center border-0">
        <Selection defaultValue={defaultCountry} width="w-full" name="country">
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
    </div>
  );
}
