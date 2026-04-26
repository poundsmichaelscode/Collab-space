import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { UserModel } from '../../db/models/user.model.js';
import { env } from '../../config/env.js';
import { AppError } from '../../common/utils/app-error.js';

type JwtUser = {
  _id: string;
  email: string;
  refreshTokenVersion?: number;
};

type SanitizedUser = {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
};

function signAccessToken(user: Pick<JwtUser, '_id' | 'email'>) {
  return jwt.sign({ sub: user._id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  } as jwt.SignOptions);
}

function signRefreshToken(user: JwtUser) {
  return jwt.sign(
    { sub: user._id, email: user.email, version: user.refreshTokenVersion ?? 0 },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  const isProd = env.NODE_ENV === 'production' || env.COOKIE_SECURE;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearRefreshCookie(res: Response) {
  const isProd = env.NODE_ENV === 'production' || env.COOKIE_SECURE;

  res.clearCookie('refreshToken', {
    path: '/api/v1/auth',
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd
  });
}

function sanitizeUser(user: {
  _id: unknown;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
}): SanitizedUser {
  return {
    _id: String(user._id),
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? null
  };
}

async function buildAuthPayload(
  user: {
    _id: unknown;
    email: string;
    username: string;
    fullName: string;
    avatarUrl?: string | null;
    refreshTokenVersion?: number;
  },
  res?: Response
) {
  const accessToken = signAccessToken({ _id: String(user._id), email: user.email });
  const refreshToken = signRefreshToken({
    _id: String(user._id),
    email: user.email,
    refreshTokenVersion: user.refreshTokenVersion
  });

  if (res) setRefreshCookie(res, refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
}

export async function registerUser(
  payload: {
    email: string;
    username: string;
    fullName: string;
    password: string;
  },
  res?: Response
) {
  const normalizedEmail = payload.email.toLowerCase();
  const normalizedUsername = payload.username.toLowerCase();

  const existing = await UserModel.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
  });

  if (existing) throw new AppError('Email or username already in use', 409, 'IDENTITY_TAKEN');

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await UserModel.create({
    email: normalizedEmail,
    username: normalizedUsername,
    fullName: payload.fullName.trim(),
    passwordHash
  });

  return buildAuthPayload(user, res);
}

export async function loginUser(payload: { email: string; password: string }, res?: Response) {
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() });
  if (!user) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const valid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  return buildAuthPayload(user, res);
}

export async function refreshSession(token: string, res?: Response) {
  let decoded: { sub: string; email: string; version: number };
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; email: string; version: number };
  } catch {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await UserModel.findById(decoded.sub);
  if (!user || user.refreshTokenVersion !== decoded.version) {
    throw new AppError('Refresh token expired', 401, 'REFRESH_REVOKED');
  }

  user.refreshTokenVersion += 1;
  await user.save();
  return buildAuthPayload(user, res);
}

export async function logoutUser(userId: string | null, res?: Response) {
  if (userId) {
    await UserModel.findByIdAndUpdate(userId, { $inc: { refreshTokenVersion: 1 } });
  }

  if (res) clearRefreshCookie(res);
  return { loggedOut: true };
}

export async function getCurrentUser(userId: string) {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return sanitizeUser(user);
}
