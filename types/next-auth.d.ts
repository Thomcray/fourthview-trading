import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      countryCode: string;
      phone: string;
      country: string;
      address: string;
      userRole: string;
    } & DefaultSession["user"];
  }
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  country: string;
  address: string;
  userRole: string;
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    countryCode: string;
    phone: string;
    country: string;
    address: string;
    userRole: string;
  }
}
