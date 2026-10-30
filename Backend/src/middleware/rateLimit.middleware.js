// Small in-memory limiter for local development. Use a shared store when deploying multiple instances.
const buckets = new Map();
export function basicRateLimit({ windowMs = 60_000, max = 100 } = {}) {
  return (req, res, next) => {
    const key = req.ip || 'local'; const now = Date.now(); const entry = buckets.get(key);
    if (!entry || now - entry.start > windowMs) buckets.set(key, { start: now, count: 1 });
    else { entry.count += 1; if (entry.count > max) return res.status(429).json({ success: false, message: 'Too many requests. Please try again shortly.' }); }
    next();
  };
}
