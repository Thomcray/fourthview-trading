"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Power } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <form action={handleSignOut}>
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 
            hover:from-orange-600 hover:to-orange-700 text-white font-medium py-5 px-4 
            rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 
            disabled:cursor-not-allowed disabled:hover:shadow-md cursor-pointer"
        >
          {/* Animated background effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <div className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-base font-semibold">Signing out...</span>
              </>
            ) : (
              <>
                <Power className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 duration-300" />
                <span className="text-base font-semibold">Sign Out</span>
              </>
            )}
          </div>
        </Button>
      </form>
    </motion.div>
  );
}
