import { AppProvider } from "@/components/AppContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { Outfit } from "next/font/google";
import { getAllProducts, getCategories } from "../_lib/data-services";

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
      <AppProvider products={products || []} categories={categories || []}>
        <Header />
        <div className="w-full flex-1 border-0">
          <main className="mx-auto border-0">{children}</main>
        </div>
      </AppProvider>
      <Footer />
    </div>
  );
}
