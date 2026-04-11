"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRoundCog, WalletCards, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import AdminButton from "./AdminButton";
import SignOutButton from "./SignOutButton";

export default function AccountSide() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user.userRole;

  const links = [
    {
      href: "/account/profile",
      label: "Account",
      icon: <UserRoundCog className="w-5 h-5" />,
    },
    {
      href: "/account/purchased-items",
      label: "Purchased items",
      icon: <WalletCards className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className="flex flex-row lg:flex-col justify-between border-b lg:border-b-0 lg:border-r px-4 
      py-3 lg:px-5 lg:py-5 w-full lg:w-64 max-sm:overflow-x-scroll"
    >
      <nav className="flex flex-row lg:flex-col gap-2 lg:space-y-2">
        <div className="flex flex-col space-y-1">
          <h1 className="text-xs text-slate-500 font-medium hidden lg:block">
            GENERAL
          </h1>
          <ul>
            <li>
              <Link
                href="/account/profile"
                title="Account"
                className={`hover:bg-blue-50 px-3 lg:px-4 py-2 rounded-md hover:text-blue-500 transition-colors 
              flex items-center gap-2 font-light
              ${pathname === "/account/profile" ? "text-blue-900 border rounded-md font-normal" : "text-slate-500"}`}
              >
                <UserRoundCog className="w-5 h-5 shrink-0" />
                <span className="text-sm lg:text-base whitespace-nowrap">
                  Account
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-1">
          <h1 className="text-xs text-slate-500 font-medium hidden lg:block">
            OTHER
          </h1>
          <ul>
            <li>
              <Link
                href="/account/purchased-items"
                title="Purchased items"
                className={`hover:bg-blue-50 px-3 lg:px-4 py-2 rounded-md hover:text-blue-500 transition-colors 
              flex items-center gap-2 font-light
              ${pathname === "/account/purchased-items" ? "text-blue-900 border rounded-md font-normal" : "text-slate-500"}`}
              >
                <WalletCards className="w-5 h-5 shrink-0" />
                <span className="text-sm lg:text-base whitespace-nowrap">
                  Purchased items
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="flex flex-row lg:flex-col gap-2">
        {isAdmin === "admin" && <AdminButton />}
        <SignOutButton />
      </div>
    </aside>
  );
}
