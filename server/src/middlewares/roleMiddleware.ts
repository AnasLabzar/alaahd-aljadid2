import { Request, Response, NextFunction } from 'express';

// Middleware to check for user roles
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Now TypeScript knows `user` exists on `req`

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};
