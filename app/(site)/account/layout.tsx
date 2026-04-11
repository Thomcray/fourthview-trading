import AccountSide from "@/components/Sidebar/AccountSide";

type Children = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: Children) {
  return (
    <div className="flex flex-col lg:flex-row min-h-full border">
      <AccountSide />
      <div className="w-full min-w-0 py-2">{children}</div>
    </div>
  );
}
