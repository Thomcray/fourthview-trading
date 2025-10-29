"use client";

import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function AdminButton() {
  const router = useRouter();

  const loginAdmin = () => {
    router.push("/admin");
  };

  return (
    <Button
      className="flex items-center w-full gap-2 px-5 py-5 font-normal bg-red-500 
    text-white cursor-pointer"
      onClick={loginAdmin}
    >
      <Lock className="w-5 h-5 text-primary-600" />
      <span className="text-base">Admin</span>
    </Button>
  );
}
