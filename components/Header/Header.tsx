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

  return (
    <header
      className={`border-0 py-4 px-8 max-sm:px-4 shadow-xl ${pathname !== "/" ? "bg-white" : "bg-blue-50"}`}
    >
      <div className="w-full mx-auto flex flex-row justify-between items-center border-0">
        <div className="w-full flex items-center gap-1 border-0 max-sm:w-fit">
          <Link href="/">
            <Image
              src={fourthviewLogo}
              alt="fourthviewLogo"
              width={50}
              height={50}
              priority
              className="object-cover border-0"
            />
          </Link>
          <h2
            className={`text-5xl font-extrabold text-blue-950 flex flex-col
              ${dancingScript.className}`}
          >
            fourthview
            <span className="text-base font-bold block">
              Trading Company. Ltd
            </span>
          </h2>
        </div>

        <Navigation />
      </div>
    </header>
  );
}
