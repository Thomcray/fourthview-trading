import Selection from "./Selection";
import { getCountries } from "@/app/_lib/data-services";
import { Input } from "./ui/input";

export default async function SelectCountryData() {
  const defaultCountry = "Federal Republic of Nigeria";

  const countries = await getCountries();

  const countryCode = countries.find(
    (country: any) => country.name.official === defaultCountry
  ).idd.root;

  const countryDial = countries.find(
    (country: any) => country.name.official === defaultCountry
  ).idd.suffixes[0];

  const defaultDialCode = countryCode + countryDial;

  const dialCode = countries.map(
    (country: any) => country.idd.root + country.idd.suffixes[0]
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
            .sort((a: any, b: any) =>
              a.name.common.localeCompare(b.name.common)
            )
            .map((country: any) => (
              <option value={country.name.official} key={country.name.official}>
                {country.name.common}
              </option>
            ))}
        </Selection>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>

        <div className="flex flex-row space-x-1 items-center border-0">
          <div className="flex flex-row space-x-1 items-center border-0">
            <Selection
              placeholder={defaultDialCode}
              width="w-32"
              name="countryCode"
            >
              {uniqueDialCodes.map((code: any) => (
                <option value={code} key={code}>
                  {code}
                </option>
              ))}
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
