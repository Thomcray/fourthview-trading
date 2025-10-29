import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // check if user === admin
    if (path.startsWith("/admin") && token?.userRole !== "admin") {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Allow access to other route
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // check if user is logged in
        return !!token;
      },
    },

    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/cart", "/admin/:path*"],
};
