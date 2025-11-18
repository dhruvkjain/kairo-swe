import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const sessionToken = req.cookies.get("sessionToken")?.value;
    const { pathname } = req.nextUrl;

    // public routes => no auth check
    const publicRoutes = ["/signin", "/signup", "/verify-email", "/terms_and_conditions", "/api/auth/signin", "/api/auth/signup", "/api/auth/verify"];
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // no session token => redirect to signin
    if (!sessionToken) {
        const url = req.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url);
    }
}

// protect these routes
export const config = {
    matcher: [
        "/profile/:path*",
        "/student_dashboard/:path*",
        "/recruiter_dashboard/:path*",
        "/api/:path*", // protect API routes too
    ],
};
