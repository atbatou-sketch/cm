import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {
  return null;
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
