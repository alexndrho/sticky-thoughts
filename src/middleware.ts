import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/settings"];
const authRoutes = ["/signin"]; // Routes to restrict for logged-in users

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("authjs.session-token")?.value;
  const currentPath = req.nextUrl.pathname;

  // Check if user is authenticated
  let isAuthenticated = false;
  if (sessionToken) {
    try {
      const decodedToken = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
      });
      isAuthenticated = !!decodedToken;
    } catch (error) {
      console.error("Failed to decode session token:", error);
    }
  }

  // Redirect unauthorized users trying to access protected routes
  if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Redirect logged-in users away from signin or register pages
  if (isAuthenticated && authRoutes.includes(currentPath)) {
    // Redirect to dashboard or another page
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings(.*)", "/signin"], // Apply middleware to relevant routes
};
