import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <form action={handleSignOut}>
      <Button className="flex items-center w-full gap-2 px-5 py-5 font-normal bg-orange-500 text-white cursor-pointer">
        <LogOut className="w-5 h-5 text-primary-600" />
        <span className="text-base">Sign out</span>
      </Button>
    </form>
  );
}
