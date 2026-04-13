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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(false);
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile overlay */}
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
          {/* Sidebar — fixed on mobile, in normal flow on desktop */}
          <div
            className={`
              shrink-0 h-[calc(100vh-64px)] sticky top-16
              transition-transform duration-300
              ${
                isMobile
                  ? `fixed top-16 left-0 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
                  : "relative translate-x-0"
              }
            `}
          >
            <AdminSide />
          </div>

          {/* Main content — naturally fills remaining space */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
