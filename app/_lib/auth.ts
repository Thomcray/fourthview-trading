import NextAuth, { NextAuthOptions } from "next-auth";
import { getUserByEmail, getUserRole } from "./data-services";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type Credentials = {
  email: string;
  password: string;
};

const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "johndoe@example.com",
        },

        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },

      async authorize(credentials, req) {
        const { email, password } = credentials as Credentials;

        const existingUser = await getUserByEmail(email);
        if (!existingUser) return null;

        const validPassword = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!validPassword) return null;

        let role: string = "user";

        try {
          const userRole = await getUserRole(existingUser.id);
          if (userRole) role = userRole.role;
        } catch (error) {
          console.log("Use default user-role");
        }

        const returnUser = {
          id: existingUser.id.toString(),
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          countryCode: existingUser.countryCode,
          phone: existingUser.phone,
          country: existingUser.country,
          userRole: role,
        };

        // console.log("Returning user...", returnUser);

        return returnUser;
      },
    }),
  ],

  callbacks: {
    // JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.countryCode = (user as any).countryCode;
        token.phone = (user as any).phone;
        token.country = (user as any).country;
        token.userRole = (user as any).userRole;
      }
      return token;
    },
    //session
    async session({ session, token }) {
      // this sends properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.countryCode = token.countryCode as string;
        session.user.phone = token.phone as string;
        session.user.country = token.phone as string;
        session.user.userRole = token.userRole as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
};
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
