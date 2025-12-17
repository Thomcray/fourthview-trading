"use client";

import { updateUserProfile } from "@/app/_lib/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserImage from "@/components/UserImage";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "react-toastify";

export default function ProfileForm({
  children,
  userId,
  firstName,
  lastName,
  email,
  address,
}: {
  children: React.ReactNode;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}) {
  const { data: session } = useSession();
  const nameInitial = session?.user.firstName.charAt(0);

  const [isPending, startTransition] = useTransition();

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const countryCode = formData.get("countryCode") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const address = formData.get("address") as string;

    startTransition(async () => {
      try {
        if (userId) {
          await updateUserProfile(countryCode, phone, country, address, userId);
          toast.success("Profile updated successfully");
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };
  return (
    <div className="px-5 py-5 border-0 flex flex-col space-y-5">
      <UserImage nameInitial={nameInitial} session={session} />
      <div className="w-full px-4 py-4 border rounded-md">
        <h1 className="text-base">Contact Details</h1>

        <form className="w-full space-y-4" onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-2 max-sm:grid-cols-1  gap-4 border-0 py-4">
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
                defaultValue={firstName}
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
                defaultValue={lastName}
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
                defaultValue={email}
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>

            {children}

            <div>
              <label
                htmlFor="address"
                className="flex flex-row items-center gap-0.5 text-sm font-normal text-gray-700"
              >
                Address
                <SquarePen size={12} />
              </label>
              <Input
                type="text"
                name="address"
                defaultValue={address}
                className="mt-1 block w-full px-3 py-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-40 cursor-pointer  py-6 px-4 bg-blue-950 text-white font-semibold rounded 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isPending ? "Updating..." : "Update"}
          </Button>
        </form>
      </div>
    </div>
  );
}
