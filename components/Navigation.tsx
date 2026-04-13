// components/Navigation.tsx
"use client";

import {
  HelpCircle,
  type LucideIcon,
  ShoppingCart,
  UserRound,
  LogOut,
  Settings,
  Heart,
  Package,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useApp } from "./AppContext";
import { useState, useEffect, useRef } from "react";

type NavType = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
};

interface NavigationProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Navigation({ isMobile, onClose }: NavigationProps) {
  const navList: Array<NavType> = [
    { name: "help", href: "/help", icon: HelpCircle },
    { name: "cart", href: "/cart", icon: ShoppingCart, badge: true },
  ];

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cart } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartItemCount = cart?.length || 0;
  const userInitial =
    session?.user?.firstName?.charAt(0) ||
    session?.user?.email?.charAt(0) ||
    "U";

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
    setUserMenuOpen(false);
  };

  // Mobile version
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {/* Help Link */}
        <Link
          href="/help"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help Center</span>
        </Link>

        {/* Cart Link */}
        <Link
          href="/cart"
          onClick={handleLinkClick}
          className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
          </div>
          {status === "authenticated" && cartItemCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Auth Links */}
        {status === "unauthenticated" ? (
          <>
            <Link
              href="/signin"
              onClick={handleLinkClick}
              className="mx-4 mt-2 text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={handleLinkClick}
              className="mx-4 text-center border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Create Account
            </Link>
          </>
        ) : (
          <>
            <div className="border-t border-gray-100 my-2 pt-2">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-800">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <Link
                href="/account/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserRound className="w-5 h-5" />
                <span>My Account</span>
              </Link>
              <Link
                href="/account/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>My Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </nav>
    );
  }

  // Desktop version
  return (
    <nav className="flex items-center gap-3">
      {/* Navigation Icons */}
      {navList.map((item) => (
        <div key={item.name} className="relative">
          <Link
            href={item.href}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200
              ${
                pathname === item.href
                  ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              }
            `}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.badge && status === "authenticated" && cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      ))}

      {/* Auth Section */}
      {status === "unauthenticated" ? (
        <div className="flex items-center gap-2 ml-2">
          <Link
            href="/signin"
            className="text-sm font-medium text-gray-700 hover:text-blue-700 px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
              ${
                pathname.startsWith("/account")
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }
            `}
          >
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {userInitial}
              </span>
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              {session?.user?.firstName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Link
                href="/account/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserRound className="w-4 h-4" />
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              <Link
                href="/wishlist"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link
                href="/settings"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
