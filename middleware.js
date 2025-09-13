import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session_token";

async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { ok: true, payload };
  } catch (e) {
    return { ok: false, error: e };
  }
}

export async function middleware(req) {
  console.log("Cookies:", req.cookies.get(COOKIE_NAME));
  const pathname = req.nextUrl.pathname;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const res = await verifyToken(token);
  if (!res.ok) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/meals/share", "/trainings/:path*"],
};
