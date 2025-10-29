"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const nameInitial = session?.user.firstName.charAt(0);
  return (
    <div className="px-5 py-5 border-0 flex flex-col space-y-5">
      <div className="flex items-center justify-center rounded-full w-40 h-40 border">
        {session?.user.image ? (
          <Image src={session.user.image} alt="user-image" className="" />
        ) : (
          <div className="w-full flex justify-center bg-white text-center rounded-full">
            <p className="text-6xl text-blue-900">{nameInitial}</p>
          </div>
        )}
      </div>

      <div className="w-full px-4 py-4 border rounded-md">
        <h1 className="text-base">Contact Details</h1>

        <form className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4 border-0 py-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-normal text-gray-700"
              >
                First Name
              </label>
              <Input
                type="text"
                name="firstName"
                defaultValue={session?.user.firstName}
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-normal text-gray-700"
              >
                Last Name
              </label>
              <Input
                type="text"
                name="lastName"
                defaultValue={session?.user.lastName}
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                name="email"
                defaultValue={session?.user.email}
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>

            {children}
          </div>

          <Button
            type="submit"
            className="w-40 cursor-pointer  py-6 px-4 bg-blue-950 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {/* {isPending ? "Loading..." : "Sign In"} */}
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}
