"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";

export default function MenuButton() {
  const [open, setOpen] = useState(false);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    // Hide text after 5 seconds
    const timer = setTimeout(() => {
      setShowText(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute top-30 left-4 z-50">
      <div className="relative">
        {!open && (
          <Button
            onMouseEnter={() => setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            variant="outline"
            className="bg-blue-900 hover:bg-blue-900/50 border-blue-900 text-white py-4 flex items-center justify-center cursor-pointer hover:text-white transition-all duration-300"
            onClick={() => setOpen(!open)}
          >
            <Menu
              className={`text-white ${showText ? "ml-0" : "ml-2"}`}
              strokeWidth={2}
              size={24}
            />
            <span
              className={`font-medium transition-all duration-700 overflow-hidden ${
                showText ? "max-w-25 opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              Menu
            </span>
          </Button>
        )}

        {open && <MenuDrawer open={open} setOpen={setOpen} />}
      </div>
    </div>
  );
}
