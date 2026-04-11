"use client";

import { useSession } from "next-auth/react";
import UserImage from "../UserImage";
import {
  Building2,
  DollarSign,
  ListOrdered,
  PlaneTakeoff,
  ShoppingBag,
  Sofa,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DrawerMenu = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function MenuDrawer({ open, setOpen }: DrawerMenu) {
  const { data: session } = useSession();
  const nameInitial = session?.user.firstName?.charAt(0);
  const pathname = usePathname();

  const menuList = [
    { title: "Change Money with Us", path: "/change-money", icon: DollarSign },
    { title: "Shop with Us", path: "/shop", icon: ShoppingBag },
    {
      title: "Travel Guide / Factory Visit",
      path: "/travel",
      icon: PlaneTakeoff,
    },
    { title: "Furniture", path: "/furniture", icon: Sofa },
    { title: "Open a Company", path: "/open-a-company", icon: Building2 },
    { title: "Special Order", path: "/special-order", icon: ListOrdered },
  ];

  return (
    <div className="absolute top-12 left-0 z-50 w-72 rounded-xl shadow-2xl overflow-hidden border border-slate-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
      {/* User profile section */}
      <div className="flex flex-col items-center gap-3 bg-blue-950 py-6 px-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={2} />
        </button>

        <UserImage
          nameInitial={nameInitial}
          session={session}
          width="w-20"
          height="h-20"
        />

        {session ? (
          <div className="text-center">
            <h1 className="text-white font-semibold text-lg leading-tight">
              {session.user.firstName} {session.user.lastName}
            </h1>
            <p className="text-blue-300 text-xs mt-0.5">{session.user.email}</p>
          </div>
        ) : (
          <p className="text-blue-300 text-sm">Welcome, Guest</p>
        )}
      </div>

      {/* Nav links */}
      <nav className="py-2 px-2">
        <ul className="flex flex-col">
          {menuList.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.title}>
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex flex-row items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-light transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-900 font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-700" : "text-slate-400"}`}
                  />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
