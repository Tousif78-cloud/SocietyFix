import { env } from '../config/env.js';
import { store } from '../models/store.js';
import { loginUser, registerUser, safeUser } from '../services/auth.service.js';
import { ok } from '../utils/response.js';
export async function register(req, res) { const user = await registerUser(req.body); return ok(res, safeUser(user), 201); }
export async function login(req, res) { const { user, sessionId, maxAge } = await loginUser(req.body); res.cookie(env.sessionCookieName, sessionId, { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production', maxAge, path: '/' }); return ok(res, safeUser(user)); }
export function me(req, res) { return ok(res, req.user); }
export function logout(req, res) { const sessionId = req.cookies?.[env.sessionCookieName]; if (sessionId) store.sessions.delete(sessionId); res.clearCookie(env.sessionCookieName, { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production', path: '/' }); return ok(res, { loggedOut: true }); }
