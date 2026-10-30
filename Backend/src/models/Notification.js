import { store } from './store.js';
export const NotificationModel = { forUser(userId) { return store.notifications.filter(n => n.recipientId === userId); } };
