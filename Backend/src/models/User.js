import { store } from './store.js';
export const UserModel = {
  findByEmail(email) { return store.users.find(u => u.email === String(email || '').trim().toLowerCase()) || null; },
  findById(id) { return store.users.find(u => u.id === id) || null; },
  all() { return store.users.map(({ passwordHash, ...u }) => ({ ...u })); },
};
