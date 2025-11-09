import Selection from "./Selection";
import { getCountries } from "@/app/_lib/data-services";
import { Input } from "./ui/input";

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

export default async function SelectCountryData() {
  const defaultCountry = "Federal Republic of Nigeria";

  const countries: Country[] = await getCountries();

  const defaultCountryData = countries.find(
    (country) => country.name.official === defaultCountry
  );

  const countryCode = defaultCountryData?.idd.root || "";
  const countryDial = defaultCountryData?.idd.suffixes[0] || "";
  const defaultDialCode = countryCode + countryDial;

  const dialCode = countries.map(
    (country) => country.idd.root + country.idd.suffixes[0]
  );

  const uniqueDialCodes = Array.from(new Set(dialCode));

  return (
    <div className="flex flex-col items-center gap-4 w-full border-0">
      <div className="w-full border-0">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Country
        </label>
        <Selection
          placeholder="Select your country..."
          width="w-full"
          name="country"
        >
          {countries
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .map((country) => (
              <option value={country.name.official} key={country.name.official}>
                {country.name.common}
              </option>
            ))}
        </Selection>
      </div>

      <div className="w-full border-0">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>

        <div className="w-full flex flex-row space-x-1 items-center border-0">
          <div className="w-full flex flex-row space-x-1 items-center border-0">
            <Selection
              placeholder={defaultDialCode}
              defaultValue={defaultDialCode}
              width="w-fit"
              name="countryCode"
            >
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
              className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
