import { env } from '../config/env.js';
import { store } from '../models/store.js';
import { ApiError } from '../utils/ApiError.js';
export function requireAuth(req, res, next) {
  const sessionId = req.cookies?.[env.sessionCookieName];
  const userId = sessionId ? store.sessions.get(sessionId) : null;
  const user = userId ? store.users.find(u => u.id === userId) : null;
  if (!user) return next(new ApiError(401, 'Please sign in to continue.'));
  const { passwordHash, ...safeUser } = user;
  req.user = safeUser;
  next();
}
