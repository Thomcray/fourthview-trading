import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import MenuButton from "@/components/Menu/Menu";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Menu Button Bar */}
      <div className="sticky top-0 z-40 px-4 py-2">
        <MenuButton />
      </div>
      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
