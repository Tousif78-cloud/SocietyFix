import { randomUUID } from 'node:crypto';
import { store, persistStore } from '../models/store.js';
export function notify(recipientId,complaintId,type,title,message,relatedUserId=null){if(!recipientId)return null;const item={id:randomUUID(),recipientId,complaintId,type,title,message,relatedUserId,isRead:false,createdAt:new Date().toISOString()};store.notifications.unshift(item);persistStore();return item;}
