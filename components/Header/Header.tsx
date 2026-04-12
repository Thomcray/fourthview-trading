"use client";

import Image from "next/image";
import fourthviewLogo from "@/public/fourthviewLogo.png";
import Navigation from "../Navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dancing_Script } from "next/font/google";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`w-full py-3 px-8 max-sm:px-4 border-b transition-colors ${
        isHome ? "bg-blue-50 border-blue-100" : "bg-white border-slate-100"
      } shadow-sm`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-row justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-row items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Image
            src={fourthviewLogo}
            alt="FourthView Logo"
            width={44}
            height={44}
            priority
            className="object-contain shrink-0"
          />
          <div className="flex flex-col">
            <h2
              className={`${dancingScript.className} text-3xl max-sm:text-2xl font-bold text-blue-950 leading-tight`}
            >
              fourthview
            </h2>
            <span className="text-[10px] max-sm:text-[9px] font-semibold text-blue-900 tracking-widest uppercase leading-none">
              Trading Company. Ltd
            </span>
          </div>
        </Link>

        <Navigation />
      </div>
    </header>
  );
}
