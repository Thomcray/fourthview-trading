// components/Sidebar/AccountSide.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRoundCog,
  WalletCards,
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AdminButton from "./AdminButton";
import SignOutButton from "./SignOutButton";
import { useState } from "react";

export default function AccountSide() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.userRole === "admin";

  const mainLinks = [
    {
      href: "/account/profile",
      label: "Account",
      icon: <UserRoundCog className="w-5 h-5" />,
      description: "Manage your profile",
    },
    {
      href: "/account/purchased-items",
      label: "Purchased Items",
      icon: <WalletCards className="w-5 h-5" />,
      description: "View your orders",
    },
  ];

  const secondaryLinks = [
    {
      href: "/account/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      description: "Preferences",
    },
    {
      href: "/help",
      label: "Help Center",
      icon: <HelpCircle className="w-5 h-5" />,
      description: "Support",
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/account/profile") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <UserRoundCog className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-full lg:h-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col justify-between
          bg-white border-r border-gray-200
          w-72 lg:w-80
          overflow-y-auto
        `}
      >
        <div className="flex-1">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                {session?.user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">
                  {session?.user?.firstName} {session?.user?.lastName}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            {isAdmin && (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {session?.user?.userRole}
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-6">
            {/* Main Links */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Main Menu
              </h3>
              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group flex items-center justify-between px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${
                        isActiveLink(link.href)
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        ${isActiveLink(link.href) ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"}
                      `}
                      >
                        {link.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{link.label}</p>
                        <p className="text-xs text-gray-500 hidden lg:block">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    {isActiveLink(link.href) && (
                      <ChevronRight className="w-4 h-4 text-blue-700" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Secondary Links */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quick Links
              </h3>
              <div className="space-y-1">
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    <span className="text-gray-500 group-hover:text-gray-700">
                      {link.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{link.label}</p>
                      <p className="text-xs text-gray-500 hidden lg:block">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {isAdmin && (
            <div className="mb-2">
              <AdminButton />
            </div>
          )}
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
