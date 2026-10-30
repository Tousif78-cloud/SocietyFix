export function validateComplaint(body) {
  if (!String(body.title || '').trim() || String(body.title).trim().length < 3) return 'Title must be at least 3 characters.';
  if (!String(body.description || '').trim() || String(body.description).trim().length < 10) return 'Description must be at least 10 characters.';
  return null;
}
