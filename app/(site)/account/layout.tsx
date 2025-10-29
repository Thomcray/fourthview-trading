import AccountSide from "@/components/Sidebar/AccountSide";

type Children = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Children) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-12 border max-w-5xl mx-auto">
      {/* Sidebar */}
      <AccountSide />

      {children}
    </div>
  );
}
