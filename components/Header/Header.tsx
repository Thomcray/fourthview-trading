import Image from "next/image";

import fourthviewLogo from "@/public/fourthviewLogo.png";
import Navigation from "../Navigation";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-0 py-4 px-8 max-sm:px-4 bg-blue-50 shadow-sm">
      <div className="w-full mx-auto flex flex-row justify-between items-center border-0">
        <div className="w-full flex items-center gap-2 border-0 max-sm:w-fit">
          <Link href="/">
            <Image
              src={fourthviewLogo}
              alt="fourthviewLogo"
              priority
              className="w-10 h-10 object-cover"
            />
          </Link>
          <h1 className="text-2xl font-bold text-blue-950 flex flex-col max-sm:hidden">
            Fourth View
            <span className="text-xs font-medium block">
              Trading Company. Ltd
            </span>
          </h1>
        </div>

        <Navigation />
      </div>
    </header>
  );
}
