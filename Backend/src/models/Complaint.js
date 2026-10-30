import { store } from './store.js';
export const ComplaintModel = {
  all() { return store.complaints; },
  byId(id) { return store.complaints.find(c => c.id === id) || null; },
};
