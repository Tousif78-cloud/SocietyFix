import { ApiError } from '../utils/ApiError.js';
export function requireFields(...fields) { return (req, res, next) => { const missing = fields.filter(k => req.body?.[k] === undefined || String(req.body[k]).trim() === ''); if (missing.length) return next(new ApiError(400, `Required fields: ${missing.join(', ')}`)); next(); }; }
