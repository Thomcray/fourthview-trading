"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  const isAccountPage = pathname?.startsWith("/account");

  return (
    <Link
      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 right-6 ${
        isAccountPage ? "bottom-24" : "bottom-6"
      }`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </Link>
  );
}
