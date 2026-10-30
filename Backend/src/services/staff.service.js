import { store } from '../models/store.js';
export function findActiveStaffByEmail(email) {
  return store.users.find(user => user.role === 'Staff' && user.status !== 'Inactive' && user.email === String(email || '').toLowerCase()) || null;
}
