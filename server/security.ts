import type { RequestHandler } from "express";
import { requireAuth } from "./auth";
export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
  });
  next();
};
/** All API routes are private except the exact browser OAuth callback. */
export function apiAuthentication(
  authenticate: RequestHandler = requireAuth,
): RequestHandler {
  return (req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (req.method === "GET" && req.path === "/auth/github/callback") {
      next();
      return;
    }
    authenticate(req, res, next);
  };
}
