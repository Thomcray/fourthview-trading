"use client";

import { Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminButton() {
  const router = useRouter();

  const loginAdmin = () => {
    router.push("/admin");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button
        onClick={loginAdmin}
        className="group relative w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-700 
          hover:from-red-700 hover:to-red-800 text-white font-medium py-5 px-4 
          rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        {/* Animated background effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div className="relative flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-300" />
          <span className="text-base font-semibold">Admin Panel</span>
        </div>
      </Button>
    </motion.div>
  );
}
