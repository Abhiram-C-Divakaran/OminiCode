import type { NextFunction, Request, Response } from "express";
import { getAdminAuth } from "./services/firebaseAdmin";
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string | null };
}
export type TokenVerifier = (
  token: string,
) => Promise<{ uid: string; email?: string }>;
export function createRequireAuth(verify: TokenVerifier) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    delete req.user;
    const match = /^Bearer ([^\s,]+)$/i.exec(req.get("Authorization") ?? "");
    if (!match) {
      res
        .status(401)
        .json({ error: "Authentication required.", code: "UNAUTHENTICATED" });
      return;
    }
    try {
      const decoded = await verify(match[1]);
      if (!decoded.uid) throw new Error("Missing identity");
      req.user = { id: decoded.uid, email: decoded.email ?? null };
    } catch {
      res
        .status(401)
        .json({
          error: "Your session is invalid or expired. Please sign in again.",
          code: "UNAUTHENTICATED",
        });
      return;
    }
    next();
  };
}
export const requireAuth = createRequireAuth((token) =>
  getAdminAuth().verifyIdToken(token, true),
);
export const AUTH_LIMITS = {
  ai: { limit: 20, windowMs: 60_000 },
  oauth: { limit: 10, windowMs: 60_000 },
};
/** Process-local fixed window. Bounded storage; no proxy-header trust or background timer. */
export class RateLimiter {
  private buckets = new Map<string, { count: number; reset: number }>();
  constructor(
    private options: { limit: number; windowMs: number },
    private now = Date.now,
  ) {}
  middleware() {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const time = this.now();
      for (const [key, bucket] of this.buckets)
        if (bucket.reset <= time) this.buckets.delete(key);
      const key = req.user?.id ?? req.ip ?? "unknown";
      let bucket = this.buckets.get(key);
      if (!bucket) {
        if (this.buckets.size >= 10_000) {
          res
            .status(429)
            .set("Retry-After", "60")
            .json({ error: "Please try again shortly." });
          return;
        }
        bucket = { count: 0, reset: time + this.options.windowMs };
        this.buckets.set(key, bucket);
      }
      if (++bucket.count > this.options.limit) {
        res.set(
          "Retry-After",
          String(Math.max(1, Math.ceil((bucket.reset - time) / 1000))),
        );
        res
          .status(429)
          .json({ error: "Too many requests. Please try again shortly." });
        return;
      }
      next();
    };
  }
}
export const authRateLimiter = new RateLimiter(AUTH_LIMITS.oauth);
export const aiRateLimiter = new RateLimiter(AUTH_LIMITS.ai);
