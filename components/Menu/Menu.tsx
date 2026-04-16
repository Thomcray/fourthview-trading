"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(true);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Auto-hide text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowText(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  const handleMouseEnter = () => {
    setShowText(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowText(false), 1000);
  };

  return (
    <>
      {/* Fixed positioning wrapper - KEY CHANGE */}
      <div className="fixed top-20 left-4 z-50">
        <Button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          variant="outline"
          className={`
            group relative overflow-hidden
            bg-linear-to-r from-blue-900 to-blue-800 
            hover:from-blue-800 hover:to-blue-700
            border-blue-900 text-white 
            py-3 px-4 flex items-center justify-center 
            cursor-pointer transition-all duration-300 
            shadow-md hover:shadow-lg
            ${isOpen ? "ring-2 ring-blue-400 ring-offset-2" : ""}
          `}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Menu"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="text-white shrink-0" strokeWidth={2} size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu
                  className="text-white shrink-0"
                  strokeWidth={2}
                  size={20}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.span
            className="font-medium overflow-hidden whitespace-nowrap"
            initial={false}
            animate={{
              maxWidth: showText ? "4rem" : "0rem",
              opacity: showText ? 1 : 0,
              marginLeft: showText ? "0.5rem" : "0rem",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            Menu
          </motion.span>
        </Button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <MenuDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
