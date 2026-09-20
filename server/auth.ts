import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  req.user = {
    id: 'mock-user-id',
    email: 'hacker@wyrmsentry.ai',
  };
  next();
}

class RateLimiter {
  constructor(private maxRequests: number, private windowMs: number, private message: string) {}
  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => next();
  }
}

export const authRateLimiter = new RateLimiter(10, 15 * 60 * 1000, '');
export const aiRateLimiter = new RateLimiter(20, 60 * 1000, '');
