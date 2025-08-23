import {
  HelpCircle,
  type LucideIcon,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";

type NavType = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export default function Navigation() {
  const navList: Array<NavType> = [
    { name: "Help", href: "/help", icon: HelpCircle },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Login / Sign up", href: "/login-signup", icon: UserRound },
  ];
  return (
    <nav className="border-0 w-full max-sm:w-full flex flex-row space-x-1.5 justify-end">
      <ul className="flex items-center flex-row space-x-4">
        {navList.map((item, index) => (
          <li key={index} className="inline-block">
            <Link
              href={item.href}
              className="text-blue-950 hover:text-blue-800 font-medium text-sm flex flex-row gap-x-1 items-center"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
