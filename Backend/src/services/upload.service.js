import { storageConfig } from '../config/storage.js';
export function validateImageDataUrl(value) {
  if (!value) return true;
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return false;
  return value.length <= Math.ceil(storageConfig.maxFileSizeBytes * 1.4);
}
