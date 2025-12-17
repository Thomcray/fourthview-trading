"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Signin() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        // console.log(result.error);
      } else if (result?.ok) {
        toast.success("User logged in succesfully");

        router.push("/");
      }
    });
  };
  return (
    <main className="h-full relative z-10 border-0 flex flex-col space-y-4 bg-white">
      <section className="w-full h-fit flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-none shadow-none">
          <h2
            className={`text-5xl font-extralight text-blue-950 max-sm:w-80 text-center ${dancingScript.className}`}
          >
            fourthview trading
          </h2>
          <h2 className="text-xl font-bold">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSignIn}>
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
                name="email"
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                name="password"
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer  py-6 px-4 bg-blue-950 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isPending ? "Loading..." : "Sign In"}
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
