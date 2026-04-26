import { Request, Response } from 'express';
import { created, ok } from '../../common/utils/api-response.js';
import { catchAsync } from '../../common/utils/catch-async.js';
import { getCurrentUser, loginUser, logoutUser, refreshSession, registerUser } from './auth.service.js';
import { AuthRequest, parseAuthToken, verifyAccessToken } from '../../common/middleware/auth.middleware.js';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await registerUser(req.body, res);
  return created(res, result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await loginUser(req.body, res);
  return ok(res, result);
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const cookieToken = req.cookies?.refreshToken as string | undefined;
  const bodyToken = req.body?.refreshToken as string | undefined;
  const result = await refreshSession(cookieToken ?? bodyToken ?? '', res);
  return ok(res, result);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const token = parseAuthToken(req);
  let userId: string | null = null;
  if (token) {
    try {
      userId = verifyAccessToken(token).sub;
    } catch {}
  }
  const result = await logoutUser(userId, res);
  return ok(res, result);
});

export const me = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await getCurrentUser(req.user!.sub);
  return ok(res, { user });
});
