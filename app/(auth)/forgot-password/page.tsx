"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Dancing_Script } from "next/font/google";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ForgotPassword() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(
            data.message || "Something went wrong. Please try again.",
          );
          return;
        }

        toast.success(data.message);
        setEmail("");
      } catch (error) {
        console.error("Forgot password error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className={`mb-2 text-4xl font-bold text-gray-900 sm:text-5xl ${dancingScript.className}`}
          >
            fourthview trading
          </h1>

          <p className="text-gray-600">Reset your account password</p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="px-6 py-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Forgot Password?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Enter the email address associated with your account and
                we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border-gray-200 py-6 pl-10 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer rounded-lg bg-linear-to-r from-blue-600 to-blue-700 py-6 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Reset Link...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Reset Link
                  </div>
                )}
              </Button>
            </form>

            {/* Back to Sign In */}
            <div className="mt-8 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
