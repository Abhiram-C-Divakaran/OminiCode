// Temporary development bypass. This middleware performs no authentication or rate limiting.
import type { NextFunction,Request,Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}
export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  req.user = { id: 'mock-user-id', email: 'developer@ominicode.example' };
  next();
}
class MockRateLimiter {
  middleware() {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }
}
export const authRateLimiter = new MockRateLimiter();
export const aiRateLimiter = new MockRateLimiter();
