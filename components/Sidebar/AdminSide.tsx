"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  LayoutDashboard,
  List,
  ListOrdered,
  Settings,
  Store,
  UsersRound,
} from "lucide-react";
import { Button } from "../ui/button";

type SideMenu = {
  title: string;
  link: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function AdminSide() {
  const pathname = usePathname();

  const sideMenu = [
    {
      title: "Dashboard",
      link: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Product & Services",
      link: "/admin/product-services",
      icon: List,
    },
    {
      title: "Orders & Request",
      link: "/admin/orders-request",
      icon: ListOrdered,
    },
    {
      title: "Customers",
      link: "/admin/customers",
      icon: UsersRound,
    },
    {
      title: "Support & Tickets",
      link: "/admin/support-tickets",
      icon: HelpCircle,
    },
    {
      title: "Settings",
      link: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-max border-r pr-5 h-full flex lg:block max-sm:hidden sm:hidden border-0">
      <nav className="flex flex-col space-y-2 items-center justify-center">
        <div className="flex flex-col space-y-1 border-0">
          <ul className="flex flex-col space-y-2">
            {sideMenu.map((url) => (
              <li
                className="text-base text-slate-500 cursor-pointer"
                key={url.title}
              >
                <Link
                  href={url.link}
                  className={`hover:bg-blue-50 px-4 py-2 rounded-md hover:text-blue-500 transition-colors flex 
                items-center gap-2 font-light ${
                  pathname === url.link
                    ? "text-blue-900 border rounded-md font-normal"
                    : ""
                }`}
                >
                  {url.icon && <url.icon className="w-5 h-5" />}
                  {url.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* back to shop */}
      <Link href="/shop">
        <Button className="mt-10 flex items-center w-full gap-2 px-5 py-5 font-normal bg-blue-500 text-white cursor-pointer">
          <Store className="w-5 h-5 text-primary-600" />
          <span className="text-base">Back to store</span>
        </Button>
      </Link>
    </aside>
  );
}
