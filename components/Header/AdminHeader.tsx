import Image from "next/image";
import Link from "next/link";
import fourthviewLogo from "@/public/fourthviewLogo.png";
import { Dancing_Script } from "next/font/google";
import { Bell } from "lucide-react";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AdminHeader() {
  return (
    <header className="border-0 py-4 px-8 max-sm:px-4 shadow-xl bg-white">
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

        <div
          className="text-slate-500 border rounded-full p-2 font-light 
            text-base items-center cursor-pointer"
        >
          <Bell className="w-5 h-5 text-slate-500 hover:text-blue-800" />
        </div>
      </div>
    </header>
  );
}
