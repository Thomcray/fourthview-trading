import AccountSide from "@/components/Sidebar/AccountSide";

type Children = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Children) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <AccountSide />
        {/* Main content area with independent scrolling */}
        <main className="flex-1 min-w-0 overflow-y-auto h-screen lg:h-auto lg:max-h-screen">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
