import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const isAuthenticated = await getToken({
    req,
    secret: secret,
    cookieName: "next-auth.session-token",
  });

  console.log(!!isAuthenticated, "auth");

  if (
    (req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/room")) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
}

export const config = {
  matchter: ["/room", "/profile"],
};
