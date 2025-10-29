"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoundCog, WalletCards } from "lucide-react";
import { useSession } from "next-auth/react";
import AdminButton from "./AdminButton";
import SignOutButton from "./SignOutButton";

export default function AccountSide() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user.userRole;

  return (
    <aside className="px-5 py-5 h-96 border-r flex flex-col justify-between">
      <nav className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <h1 className="text-base text-slate-500 font-medium">GENERAL</h1>
          <ul>
            <li className="text-base text-slate-500 cursor-pointer">
              <Link
                href="/account/profile"
                className={`hover:bg-blue-50 px-4 py-2 rounded-md hover:text-blue-500 transition-colors flex 
                items-center gap-2 font-light ${
                  pathname === "/account/profile"
                    ? "text-blue-900 border rounded-md font-normal"
                    : ""
                }`}
              >
                <UserRoundCog className="w-5 h-5" />
                Account
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-1">
          <h1 className="text-base text-slate-500 font-medium border-0">
            OTHER
          </h1>
          <ul className="border-0">
            <li className="text-base text-slate-500 cursor-pointer">
              <Link
                href="/account/purchased-items"
                className={`hover:bg-blue-50 px-4 py-2 rounded-md hover:text-blue-500 transition-colors flex 
                items-center gap-2 font-light ${
                  pathname === "/account/purchased-items"
                    ? "text-blue-900 border rounded-md font-normal"
                    : ""
                }`}
              >
                <WalletCards className="w-5 h-5" />
                Purchased items
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Signout and Admin button */}
      <div className="flex flex-col gap-2">
        {isAdmin === "admin" && <AdminButton />}
        <SignOutButton />
      </div>
    </aside>
  );
}
