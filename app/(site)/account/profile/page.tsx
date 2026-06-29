import { getCountries, getUserByEmail } from "@/app/_lib/data-services";
import ProfileForm from "./ProfileForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { ArrowLeft, User } from "lucide-react";
import ProfileHeader from "./ProfileHeader";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

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

export default async function ProfilePage() {
  const session = await getServerSession();

  // Handle unauthenticated users
  if (!session?.user?.email) {
    redirect("/signin");
  }

  // Fetch countries first
  const countries = getCountries();

  // Calculate unique dial codes
  const dialCode: string[] = countries
    .map((country: Country) => {
      const root = country.idd?.root || "";
      const suffix = country.idd?.suffixes?.[0] || "";
      return root + suffix;
    })
    .filter((code: string) => code && code !== "undefined");

  const uniqueDialCodes = Array.from(new Set(dialCode));

  // Get user data
  const userData = await getUserByEmail(session.user.email!);

  const {
    id,
    firstName,
    lastName,
    email,
    countryCode,
    phone,
    country,
    streetAddress,
    apartment,
    city,
    zipCode,
    address,
  } = userData;

  return (
    <div className="w-full">
      {/* Header with back button */}
      <ProfileHeader />

      {/* Profile Content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <ProfileForm
          userId={id}
          firstName={firstName}
          lastName={lastName}
          email={email}
          streetAddress={streetAddress}
          apartment={apartment}
          city={city}
          zipCode={zipCode}
          address={address}
          initialCountryCode={countryCode}
          initialPhone={phone}
          initialCountry={country}
          countries={countries}
          uniqueDialCodes={uniqueDialCodes}
        />
      </div>
    </div>
  );
}
