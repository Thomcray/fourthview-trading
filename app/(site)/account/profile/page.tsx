import { getCountries } from "@/app/_lib/data-services";
import ProfileForm from "./ProfileForm";
import Phone from "@/components/Phone";

interface Country {
  idd: {
    root: string;
    suffixes: string[];
  };
}

export default async function page() {
  const countries = await getCountries();

  const dialCode: string[] | undefined =
    countries &&
    countries.map(
      (country: Country) => country.idd.root + country.idd.suffixes[0]
    );

  const uniqueDialCodes = Array.from(new Set(dialCode));
  return (
    <ProfileForm>
      <Phone uniqueDialCodes={uniqueDialCodes} countries={countries} />
    </ProfileForm>
  );
}
