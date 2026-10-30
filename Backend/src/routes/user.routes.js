import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { ok } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
const router=Router(); router.get('/me',requireAuth,asyncHandler(async(req,res)=>ok(res,req.user))); router.patch('/me',requireAuth,asyncHandler(async(req,res)=>{const user=(await import('../models/store.js')).store.users.find(u=>u.id===req.user.id); if(!user)throw new ApiError(404,'User not found.'); for(const k of ['name','phone','flat'])if(req.body[k]!==undefined)user[k]=String(req.body[k]).trim(); const {passwordHash,...safe}=user; return ok(res,safe);})); export default router;
