import { Metadata } from "next";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="antialiased flex flex-col min-h-screen">{children}</div>
  );
}
