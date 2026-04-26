import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../utils/app-error.js';

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

export function parseAuthToken(req: Request) {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; email: string };
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = parseAuthToken(req);

  if (!token) {
    return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
  }
}
