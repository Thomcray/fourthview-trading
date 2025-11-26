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
      title: "Travel Guide/Factory Visit",
      path: "/travel",
      icon: PlaneTakeoff,
    },
    { title: "Furniture", path: "/furniture", icon: Sofa },
    { title: "Open a Company", path: "/open-a-company", icon: Building2 },
    { title: "Special Order", path: "", icon: ListOrdered },
  ];
  return (
    <div className="fixed bg-accent flex flex-col top-4 left-4 border-0 rounded-md w-max z-50">
      <div className="relative flex flex-col space-y-2 bg-blue-950 py-4 px-4 items-center justify-center">
        <X
          className="text-white absolute right-4 top-2 cursor-pointer"
          size={24}
          strokeWidth={2}
          onClick={() => setOpen(!open)}
        />
        <div className="w-fit">
          <UserImage
            nameInitial={nameInitial}
            session={session}
            width="w-28"
            height="h-28"
          />
        </div>

        <div className="text-center">
          <h1 className="text-white font-bold text-2xl">
            {session?.user.firstName}
          </h1>
          <p className="text-white font-normal text-sm">
            {session?.user.email}
          </p>
        </div>
      </div>
      <nav className="border-0 bg-accent py-4 px-4 w-full max-sm:w-full flex flex-row space-x-1.5 justify-start">
        <ul className="flex flex-col space-y-2">
          {menuList.map((item) => (
            <li key={item.title} className="inline-block relative">
              <Link
                href={item.path}
                className={`text-slate-500 border-0 p-2 hover:text-white hover:bg-blue-900 font-light text-base flex flex-row gap-x-1 items-center
                ${pathname === item.path ? "text-blue-900 font-normal" : ""}`}
              >
                <div className="flex flex-row justify-between font-normal space-x-4 items-center">
                  <item.icon className="w-5 h-5" />
                  <h1>{item.title}</h1>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
