"use client";

import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileHeader() {
  const router = useRouter();

  return (
    <div className="relative flex flex-row items-center py-2 mb-4">
      <button
        onClick={() => router.back()}
        className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
    </div>
  );
}
