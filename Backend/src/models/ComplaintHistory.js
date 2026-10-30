import { store } from './store.js';
export const ComplaintHistoryModel = { forComplaint(complaintId) { return store.history.filter(h => h.complaintId === complaintId); } };
