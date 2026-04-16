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
      {/* Menu Button - now fixed directly on component */}
      <MenuButton />
      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
