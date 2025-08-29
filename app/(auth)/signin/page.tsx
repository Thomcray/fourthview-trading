import Image from "next/image";
import Link from "next/link";

import fourthviewLogo from "@/public/fourthviewLogo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sign In",
  description: "Sign In to your account",
};

export default function Signin() {
  return (
    <main className="relative z-10 border-0 flex flex-col space-y-4 bg-white">
      <section className="w-full h-screen flex flex-col justify-center items-center">
        <div>
          <Image
            src={fourthviewLogo}
            alt="Logo"
            priority
            className="w-20 h-20 object-contain"
          />
        </div>

        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-none shadow-none">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer  py-2 px-4 bg-blue-950 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-950 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
