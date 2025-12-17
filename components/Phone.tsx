"use client";

import { Input } from "./ui/input";
import Selection from "./Selection";
import { SquarePen } from "lucide-react";

export default function Phone({
  uniqueDialCodes,
  defaultCode,
  phone,
}: {
  uniqueDialCodes: string[];
  countries: unknown[];
  defaultCode: string;
  phone: string;
}) {
  return (
    <div>
      <label
        htmlFor="phone"
        className="flex flex-row gap-0.5 items-center text-sm font-medium text-gray-700"
      >
        Phone Number
        <SquarePen size={12} />
      </label>

      <div className="flex flex-row space-x-1 items-center border-0">
        <Selection defaultValue={defaultCode} width="w-fit" name="countryCode">
          {uniqueDialCodes.map(
            (code) =>
              code !== "undefined" && (
                <option value={code} key={code}>
                  {code}
                </option>
              )
          )}
        </Selection>

        <Input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={phone}
          className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
}
