import { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import SignupForm from "./SignupForm";
import SelectCountryData from "@/components/SelectCountryData";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create Account",
};

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function page() {
  return (
    <main className="relative border-0 flex items-center justify-center bg-white">
      <section className="py-10 space-y-5 h-fit w-full flex flex-col justify-center items-center">
        <div className="py-2">
          <h2
            className={`text-5xl font-extralight text-blue-950 max-sm:w-80 text-center ${dancingScript.className}`}
          >
            fourthview trading
          </h2>
        </div>

        <div className="w-full max-w-3xl space-y-4 bg-white rounded-none shadow-none px-8 border-0">
          <h2 className="text-xl font-semibold">Create Account</h2>

          <SignupForm>
            <SelectCountryData />
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </SignupForm>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-950 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
