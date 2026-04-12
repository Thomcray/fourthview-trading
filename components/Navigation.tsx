"use client";

import {
  HelpCircle,
  type LucideIcon,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";

type NavType = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export default function Navigation() {
  const navList: Array<NavType> = [
    { name: "help", href: "/help", icon: HelpCircle },
    { name: "cart", href: "/cart", icon: ShoppingCart },
  ];

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cart } = useApp();

  return (
    <nav className="flex flex-row items-center gap-2">
      <ul className="flex items-center flex-row gap-2">
        {navList.map((item) => (
          <li key={item.name} className="relative">
            <Link
              href={item.href}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors
                ${
                  pathname === item.href
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                }`}
            >
              <item.icon className="w-4 h-4" />

              {/* Cart badge */}
              {item.name === "cart" &&
                status === "authenticated" &&
                cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length > 9 ? "9+" : cart.length}
                  </span>
                )}
            </Link>
          </li>
        ))}

        {status === "unauthenticated" && (
          <li>
            <Link
              href="/signin"
              className="text-sm font-medium text-white bg-blue-950 hover:bg-blue-800 transition-colors px-4 py-2 rounded-full"
            >
              Sign in
            </Link>
          </li>
        )}

        {status === "authenticated" && (
          <li>
            <Link
              href="/account/profile"
              className={`flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-sm font-medium
                ${
                  pathname.startsWith("/account")
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                }`}
            >
              <UserRound className="w-4 h-4" />
              {session?.user?.firstName}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
