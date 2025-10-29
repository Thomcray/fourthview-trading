import { getCountries } from "@/app/_lib/data-services";
import ProfileForm from "./ProfileForm";
import Phone from "@/components/Phone";

export default async function page() {
  const countries = await getCountries();

  const dialCode =
    countries &&
    countries.map((country: any) => country.idd.root + country.idd.suffixes[0]);

  const uniqueDialCodes = Array.from(new Set(dialCode));
  return (
    <ProfileForm>
      <Phone uniqueDialCodes={uniqueDialCodes} countries={countries} />
    </ProfileForm>
  );
}
