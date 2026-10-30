import { store, persistStore } from '../models/store.js';
import { ok } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
export function list(req,res){return ok(res,store.notifications.filter(n=>n.recipientId===req.user.id));}
export function markRead(req,res){const n=store.notifications.find(x=>x.id===req.params.id&&x.recipientId===req.user.id);if(!n)throw new ApiError(404,'Notification not found.');n.isRead=true;persistStore();return ok(res,n);}
export function markAllRead(req,res){store.notifications.filter(n=>n.recipientId===req.user.id).forEach(n=>n.isRead=true);persistStore();return ok(res,{updated:true});}
