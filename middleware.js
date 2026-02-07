import { NextResponse } from "next/server";
import { url } from "zod";
import { WEBSITE_LOGIN } from "./routes/websiteRoutes";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const pathname = request.nextUrl.pathname;
    const hasToken = request.cookies.has("access_token");

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new url(WEBSITE_LOGIN, request.nextUrl));
      }
      return NextResponse.next();
    }

    //varify token and check user role if needed for specific routes
    const access_token = request.cookies.get("access_token");
    const {payload}= await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY));
    const role = payload.role;

    //prevent login user to access login page
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new url( role === "admin", request.nextUrl));
    }   
  } catch (error) {}
}
