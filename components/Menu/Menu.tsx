"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const [showText, setShowText] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        onMouseEnter={() => setShowText(true)}
        onMouseLeave={() => setShowText(false)}
        variant="outline"
        className="bg-blue-900 hover:bg-blue-800 border-blue-900 text-white py-4 flex items-center justify-center cursor-pointer hover:text-white transition-all duration-300 shadow-md"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Menu className="text-white shrink-0" strokeWidth={2} size={20} />
        <span
          className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
            showText
              ? "max-w-[4rem] opacity-100 ml-2"
              : "max-w-0 opacity-0 ml-0"
          }`}
        >
          Menu
        </span>
      </Button>

      {open && <MenuDrawer open={open} setOpen={setOpen} />}
    </div>
  );
}
