export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protege todo excepto:
     * - /login
     * - /api/auth (NextAuth)
     * - archivos estáticos y _next
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
