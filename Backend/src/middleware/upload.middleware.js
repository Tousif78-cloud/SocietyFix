// For now the frontend sends small image data URLs. A real upload adapter can be added later.
export function validateImageData(req, res, next) {
  const fields = ['complaintPhoto', 'resolutionPhoto'];
  for (const field of fields) {
    const value = req.body?.[field];
    if (typeof value === 'string' && value.startsWith('data:') && value.length > 12 * 1024 * 1024) {
      return res.status(413).json({ success: false, message: `${field} is too large. Please use an image under 8 MB.` });
    }
  }
  next();
}
