import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function siteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${outfit.className} antialiased flex flex-col min-h-screen`}
    >
      <Header />
      <div className="w-full flex-1 border-0">
        <main className="mx-auto border-0">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
