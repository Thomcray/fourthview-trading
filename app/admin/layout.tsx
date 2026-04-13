"use client";

import AdminHeader from "@/components/Header/AdminHeader";
import AdminSide from "@/components/Sidebar/AdminSide";
import QueryProvider from "@/app/_lib/providers/QueryProvider";
import { Outfit } from "next/font/google";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // default true to avoid SSR flash

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen, isMobile]);

  return (
    <QueryProvider>
      <div
        className={`${outfit.className} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}
      >
        <AdminHeader />

        {/* Mobile menu toggle — bottom right FAB */}
        <button
          onClick={() => setSidebarOpen((p) => !p)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <div className="flex min-h-[calc(100vh-64px)]">
          {/* Sidebar */}
          {isMobile ? (
            <div
              className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <AdminSide />
            </div>
          ) : (
            // Desktop: sticky in normal flow, pushes content naturally
            <div className="shrink-0 sticky top-16 h-[calc(100vh-64px)]">
              <AdminSide />
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
