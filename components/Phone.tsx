"use client";

import { Input } from "./ui/input";
import Selection from "./Selection";
import { SquarePen } from "lucide-react";

export default function Phone({
  uniqueDialCodes,
  phone,
  value,
  onChange,
}: {
  uniqueDialCodes: string[];
  countries: unknown[];
  phone: string;
  value: string; // Controlled - value prop required
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Controlled - onChange required
}) {
  return (
    <div className="w-full">
      <label
        htmlFor="phone"
        className="flex flex-row gap-0.5 items-center text-sm font-medium text-gray-700 mb-1"
      >
        Phone Number
        <SquarePen size={12} />
      </label>

      <div className="flex gap-2 items-start">
        <Selection
          value={value} // Only use value
          onChange={onChange} // Must provide onChange
          width="w-24"
          name="countryCode"
        >
          {uniqueDialCodes.map(
            (code) =>
              code !== "undefined" && (
                <option value={code} key={code}>
                  {code}
                </option>
              ),
          )}
        </Selection>

        <Input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={phone}
          className="flex-1 px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Phone number"
          required
        />
      </div>
    </div>
  );
}
