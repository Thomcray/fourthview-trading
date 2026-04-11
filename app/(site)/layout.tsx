import { AppProvider } from "@/components/AppContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { Outfit } from "next/font/google";
import { getAllProducts, getCategories } from "../_lib/data-services";
import MenuButton from "@/components/Menu/Menu";
import QueryProvider from "../_lib/providers/QueryProvider";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default async function siteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const data = await Promise.all([getAllProducts(), getCategories()]);
  const products = data[0];
  const categories = data[1];

  return (
    <div
      className={`${outfit.className} antialiased flex flex-col min-h-screen`}
    >
      <QueryProvider>
        <AppProvider products={products || []} categories={categories || []}>
          <Header />

          {/* MenuButton bar sits below header */}
          <div className="relative border-0 px-4 py-2">
            <MenuButton />
          </div>

          <div className="w-full flex-1 lg:px-10 max-sm:px-2">
            <main className="">{children}</main>
          </div>
        </AppProvider>
      </QueryProvider>
      <Footer />
    </div>
  );
}
