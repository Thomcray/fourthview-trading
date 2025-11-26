"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";

export default function MenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-30 left-4 z-50">
      <div className="relative">
        {!open && (
          <Button
            variant="outline"
            className=" bg-blue-950 hover:bg-blue-900 text-white py-4 flex items-center cursor-pointer hover:text-white"
            onClick={() => setOpen(!open)}
          >
            All Categories
            <Menu className="ml-2 text-white" strokeWidth={2} size={20} />
          </Button>
        )}

        {open && <MenuDrawer open={open} setOpen={setOpen} />}
      </div>
    </div>
  );
}
