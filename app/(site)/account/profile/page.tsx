import { getCountries, getUserByEmail } from "@/app/_lib/data-services";
import ProfileForm from "./ProfileForm";
import Phone from "@/components/Phone";
import Country from "@/components/Country";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Country {
  idd: {
    root: string;
    suffixes: string[];
  };
}

export default async function page() {
  const session = await getServerSession();

  // Handle unauthenticated users
  if (!session?.user?.email) {
    redirect("/login");
  }

  const countries = await getCountries();

  const dialCode: string[] | undefined =
    countries &&
    countries.map(
      (country: Country) => country.idd.root + country.idd.suffixes[0]
    );

  const uniqueDialCodes = Array.from(new Set(dialCode));

  const userData = await getUserByEmail(session.user.email!);

  const {
    id,
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    country,
    address,
  } = userData;

  return (
    <ProfileForm
      userId={id}
      firstName={firstName}
      lastName={lastName}
      email={email}
      address={address}
    >
      <Phone
        uniqueDialCodes={uniqueDialCodes}
        countries={countries}
        defaultCode={countryCode}
        phone={phone}
      />
      <Country countries={countries} defaultCountry={country} />
    </ProfileForm>
  );
}
