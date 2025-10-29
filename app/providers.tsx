"use client";

import { SessionProvider } from "next-auth/react";

type Children = {
  children: React.ReactNode;
};
export function Providers({ children }: Children) {
  return <SessionProvider>{children}</SessionProvider>;
}
