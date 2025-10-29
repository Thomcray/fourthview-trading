"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";
import { verifyEmail } from "@/app/api/send/route";
import PasswordValidity from "@/components/PasswordValidity";

type Props = {
  children: React.ReactNode;
};
export default function SignupForm({ children }: Props) {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      try {
        const res = await verifyEmail(formData);
        if (!res.success) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-row max-sm:flex-col justify-between gap-x-4 border-0 w-full">
        <div className="flex flex-col items-center gap-4 w-full border-0">
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full border-0">
          {children}

          <div className="relative w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />

            {showPassword ? (
              <Eye
                className="absolute text-gray-700 top-8 right-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <EyeClosed
                className="absolute text-gray-700 top-8 right-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
        </div>
      </div>

      <PasswordValidity password={password} />

      <Button
        type="submit"
        className="w-full cursor-pointer py-6 px-4 bg-blue-950 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isPending ? "Submitting..." : "Create Account"}
      </Button>
    </form>
  );
}
