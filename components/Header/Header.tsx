// components/Header/Header.tsx
"use client";

import Image from "next/image";
import fourthviewLogo from "@/public/fourthviewLogo.png";
import Navigation from "../Navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const headerBg = isHome
    ? isScrolled
      ? "bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-md"
      : "bg-blue-50 border-b border-blue-100"
    : "bg-white border-b border-gray-100 shadow-sm";

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          w-full py-3 px-4 sm:px-6 lg:px-8 
          transition-all duration-300
          ${headerBg}
        `}
      >
        <div className="w-full max-w-7xl mx-auto flex flex-row justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-row items-center gap-2 hover:opacity-90 transition-opacity group"
          >
            <div className="relative">
              <Image
                src={fourthviewLogo}
                alt="FourthView Logo"
                width={44}
                height={44}
                priority
                className="object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <h2
                className={`${dancingScript.className} text-2xl sm:text-3xl font-bold text-blue-950 leading-tight`}
              >
                fourthview
              </h2>
              <span className="text-[8px] sm:text-[10px] font-semibold text-blue-900 tracking-widest uppercase leading-none">
                Trading Company. Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[72px] sm:h-[80px]" />

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Image
                      src={fourthviewLogo}
                      alt="FourthView Logo"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-blue-950">Menu</h3>
                      <p className="text-xs text-gray-500">Navigate to pages</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <Navigation isMobile onClose={() => setMobileMenuOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
