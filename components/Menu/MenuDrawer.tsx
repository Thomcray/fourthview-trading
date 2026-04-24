"use client";

import { useSession } from "next-auth/react";
import {
  Building2,
  DollarSign,
  ListOrdered,
  PlaneTakeoff,
  ShoppingBag,
  Sofa,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mainMenuItems = [
  {
    title: "Change Money with Us",
    path: "/change-money",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    title: "Shop with Us",
    path: "/shop",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    title: "Travel Guide / Factory Visit",
    path: "/travel",
    icon: PlaneTakeoff,
    color: "text-purple-600",
  },
  {
    title: "Furniture",
    path: "/furniture",
    icon: Sofa,
    color: "text-amber-600",
  },
  {
    title: "Open a Company",
    path: "/open-a-company",
    icon: Building2,
    color: "text-indigo-600",
  },
  {
    title: "Study in China",
    path: "/study-in-china",
    icon: GraduationCap,
    color: "text-cyan-600",
  },
  {
    title: "Special Order",
    path: "/special-order",
    icon: ListOrdered,
    color: "text-rose-600",
  },
];

const accountMenuItems = [
  { title: "My Account", path: "/account/profile", icon: Settings },
  { title: "Help Center", path: "/help", icon: HelpCircle },
];

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuVariants = {
    hidden: { opacity: 0, x: -320 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      x: -320,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Let AnimatePresence in the parent handle unmounting — do NOT return null here

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      />

      {/* Drawer */}
      <motion.div
        variants={menuVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        className="fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Close menu"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto pt-16 px-4 pb-4">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Main Menu
            </h3>
            <ul className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <motion.li key={item.title} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className={`
                        group flex items-center justify-between px-3 py-2.5 rounded-xl
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-blue-600" : item.color} transition-colors`}
                        />
                        <span className="text-sm">{item.title}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {session && (
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Account
              </h3>
              <ul className="space-y-1">
                {accountMenuItems.map((item) => (
                  <motion.li key={item.title} variants={itemVariants}>
                    <Link
                      href={item.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {session.user.firstName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.user.firstName} {session.user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/signin"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm text-center"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg transition-colors text-sm text-center"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
