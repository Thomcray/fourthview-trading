import { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import SignupForm from "./SignupForm";
import SelectCountryData from "@/components/SelectCountryData";

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
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`text-5xl font-extralight text-blue-950 ${dancingScript.className}`}
          >
            fourthview trading
          </h2>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create Account
            </h2>
            <SignupForm />
            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
