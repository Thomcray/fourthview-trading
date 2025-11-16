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

  const cartLen = cart.length;

  return (
    <nav className="border-0 w-full max-sm:w-full flex flex-row space-x-1.5 justify-end">
      <ul className="flex items-center flex-row space-x-4">
        {navList.map((item, index) => (
          <li key={index} className="inline-block relative">
            <Link
              href={item.href}
              className={`text-slate-500 border rounded-full p-2 hover:text-blue-800 font-light text-base flex flex-row gap-x-1 items-center
                ${pathname === item.href ? "text-blue-900 font-normal" : ""}`}
            >
              {item.name === "cart" && status === "authenticated" ? (
                <>
                  <item.icon className="w-5 h-5" />
                  {cart.length > 0 && (
                    <div
                      className=" bg-red-500 text-white text-sm font-medium absolute -top-2 -right-2 border rounded-full
                     w-max px-2 py-2.5 h-4 flex items-center justify-center"
                    >
                      {cartLen}
                    </div>
                  )}
                </>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
            </Link>
          </li>
        ))}

        {status === "unauthenticated" && (
          <li className="inline-block">
            <Link
              href="/signin"
              className="text-blue-950 hover:text-blue-800 font-normal text-base flex flex-row gap-x-1 items-center"
            >
              Register
            </Link>
          </li>
        )}

        {status === "authenticated" && (
          <li className="inline-block rounded-xl px-4 py-2 border">
            <Link
              href="/account/profile"
              className="text-slate-500 hover:text-blue-800 font-medium text-base flex flex-row gap-x-1 
              items-center  cursor-pointer"
            >
              <UserRound className="w-5 h-5" />
              {session?.user?.firstName}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
