import Header from "@/components/Header/Header";
import AdminSide from "@/components/Sidebar/AdminSide";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function adminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${outfit.className} antialiasedflex flex-col min-h-screen border-0`}
    >
      <Header />
      <div className="w-full flex flex-row gap-4 justify-center px-5 py-5 border-0">
        <AdminSide />
        <main className="flex flex-col px-4 max-sm:px-0 space-y-4 mx-auto flex-1 border-0">
          {children}
        </main>
      </div>
    </div>
  );
}
