import dotenv from 'dotenv';
dotenv.config();
export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  sessionCookieName: process.env.SESSION_COOKIE_NAME || 'societyfix_session',
  sessionDays: Number(process.env.SESSION_DAYS || 7),
};
